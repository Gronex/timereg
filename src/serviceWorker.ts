export async function register() {
  if('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('./service-worker.ts');
      console.log('Registration successful, scope is:', registration.scope);
    } catch (error) {
      console.log('Service worker registration failed, error:', error);
    }
  }
}