(function(){
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const fileInput = document.getElementById('fileInput');
  const detectBtn = document.getElementById('detectBtn');
  const clearBtn = document.getElementById('clearBtn');
  const chips = document.querySelectorAll('.chip[data-sample]');
  const resultsList = document.getElementById('resultsList');
  const stats = document.getElementById('stats');

  let currentImage = new Image();
  let boxes = [];

  function fitAndDrawImage(img){
    const cw = canvas.width;
    const ch = canvas.height;
    ctx.clearRect(0,0,cw,ch);
    const ratio = Math.min(cw / img.width, ch / img.height);
    const w = img.width * ratio;
    const h = img.height * ratio;
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;
    ctx.drawImage(img, x, y, w, h);
    return {x, y, w, h, ratio};
  }

  function drawBoxes(){
    boxes.forEach(b => {
      ctx.strokeStyle = `rgba(109,242,255,0.95)`;
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, b.y, b.w, b.h);

      const label = `${b.label} ${(b.confidence*100).toFixed(1)}%`;
      ctx.fillStyle = 'rgba(6, 9, 19, 0.8)';
      ctx.fillRect(b.x, b.y - 20, ctx.measureText(label).width + 12, 18);
      ctx.fillStyle = '#6df2ff';
      ctx.font = '12px Inter, system-ui';
      ctx.fillText(label, b.x + 6, b.y - 6);
    });
  }

  function updateResults(){
    resultsList.innerHTML = '';
    if (!boxes.length){
      stats.textContent = 'No results yet';
      return;
    }
    stats.textContent = `${boxes.length} detections`;
    boxes.forEach((b, i) => {
      const div = document.createElement('div');
      div.className = 'result-card';
      div.innerHTML = `
        <div class="result-top">
          <strong>#${i+1} ${b.label}</strong>
          <span class="tag success">${(b.confidence*100).toFixed(1)}%</span>
        </div>
        <div class="muted">x:${Math.round(b.x)}, y:${Math.round(b.y)}, w:${Math.round(b.w)}, h:${Math.round(b.h)}</div>
      `;
      resultsList.appendChild(div);
    });
  }

  function loadImageFromSrc(src){
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function enableActions(enabled){
    detectBtn.disabled = !enabled;
    clearBtn.disabled = !enabled;
  }

  function setImage(img){
    currentImage = img;
    fitAndDrawImage(currentImage);
    boxes = [];
    updateResults();
    enableActions(true);
  }

  // Simulated detection: deterministic pseudo-random boxes based on image size
  function simulateDetection(){
    const cw = canvas.width;
    const ch = canvas.height;
    // Use center crop bounds (where image was drawn)
    const bounds = fitAndDrawImage(currentImage);
    const seed = (currentImage.width + currentImage.height + Math.floor(Math.random()*1000)) % 9973;
    const rng = mulberry32(seed);
    const labels = ['Fish','Coral','Submersible','Seaweed','Rock'];
    const count = 2 + Math.floor(rng()*3);
    const generated = [];
    for(let i=0;i<count;i++){
      const w = 80 + rng()*Math.max(60, bounds.w*0.25);
      const h = 60 + rng()*Math.max(50, bounds.h*0.22);
      const x = bounds.x + rng()*(bounds.w - w);
      const y = bounds.y + rng()*(bounds.h - h);
      const confidence = 0.6 + rng()*0.35;
      generated.push({x, y, w, h, label: labels[Math.floor(rng()*labels.length)], confidence});
    }
    boxes = generated;
    fitAndDrawImage(currentImage);
    drawBoxes();
    updateResults();
  }

  function mulberry32(a){
    return function(){
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }

  // Events
  fileInput.addEventListener('change', function(){
    const file = this.files && this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = e.target.result;
    }
    reader.readAsDataURL(file);
  });

  chips.forEach(chip => {
    chip.addEventListener('click', async function(){
      try{
        const img = await loadImageFromSrc(this.dataset.sample);
        setImage(img);
      }catch(err){
        alert('Failed to load sample image.');
      }
    });
  });

  detectBtn.addEventListener('click', function(){
    if (!currentImage) return;
    simulateDetection();
  });

  clearBtn.addEventListener('click', function(){
    boxes = [];
    fitAndDrawImage(currentImage);
    updateResults();
  });
})();


