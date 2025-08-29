
import { navigation, navigationTag } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  navigation(location.pathname);
  navigationTag();
});
