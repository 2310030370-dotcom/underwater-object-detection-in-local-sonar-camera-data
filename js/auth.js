(function(){
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      if (!email || password.length < 6) {
        alert('Please enter a valid email and a password with 6+ characters.');
        return;
        }
      // Simulate login and store a simple token
      const token = 'uod_demo_' + Math.random().toString(36).slice(2);
      localStorage.setItem('uod_auth_token', token);
      localStorage.setItem('uod_user_email', email);
      window.location.href = 'app.html';
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(){
      localStorage.removeItem('uod_auth_token');
      localStorage.removeItem('uod_user_email');
      window.location.href = 'index.html';
    });
  }

  // Guard dashboard route
  if (location.pathname.endsWith('app.html')) {
    if (!localStorage.getItem('uod_auth_token')) {
      window.location.href = 'index.html';
    }
  }
})();


