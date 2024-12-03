export default defineNuxtRouteMiddleware((async) => {
  // const myCookie = from.cookies.enteredPassword;
  // const myCookie = getCookie(event, 'enteredPassword');
  const myCookie = useCookie('enteredPassword');

  console.log(myCookie);

  if (!myCookie || myCookie.value !== 'Smurf999') {
    return navigateTo('/admin/login');
    
  }
});
