# TODO: Implement Session Storage Auth Protection

- [x] Modify frontend/src/Pages/AdminPanel.jsx:
  - Add useEffect to check sessionStorage for 'isLoggedIn' on component mount.
  - If sessionStorage.getItem('isLoggedIn') !== 'true', navigate to '/login'.
