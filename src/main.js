// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// PrimeVue
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import Steps from 'primevue/steps';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import Menu from 'primevue/menu';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import Card from 'primevue/card';
import FileUpload from 'primevue/fileupload';
import Chip from 'primevue/chip';
import Avatar from 'primevue/avatar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Divider from 'primevue/divider';
import InlineMessage from 'primevue/inlinemessage';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import RadioButton from 'primevue/radiobutton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import OverlayPanel from 'primevue/overlaypanel';
import Dialog from 'primevue/dialog';

// PrimeVue Styles
import 'primevue/resources/themes/lara-light-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

// Tailwind CSS
import './assets/css/index.css';

// Import API debugger in development mode
if (process.env.NODE_ENV === 'development') {
  import('./utils/api-debugger');
  import('./utils/direct-profile-test');
  import('./utils/simple-profile-test');
  import('./utils/api-troubleshooter');
  console.log(
    '%cDevelopment mode detected - API testing utilities loaded',
    'color: orange; font-weight: bold;'
  );
}

// Create app
const app = createApp(App);

// Use plugins
app.use(createPinia());
app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(ConfirmationService);

// Register PrimeVue components
app.component('Button', Button);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Dropdown', Dropdown);
app.component('MultiSelect', MultiSelect);
app.component('Calendar', Calendar);
app.component('Textarea', Textarea);
app.component('Checkbox', Checkbox);
app.component('Steps', Steps);
app.component('Toast', Toast);
app.component('Menu', Menu);
app.component('ProgressBar', ProgressBar);
app.component('Tag', Tag);
app.component('Badge', Badge);
app.component('Card', Card);
app.component('FileUpload', FileUpload);
app.component('Chip', Chip);
app.component('Avatar', Avatar);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Divider', Divider);
app.component('InlineMessage', InlineMessage);
app.component('ConfirmDialog', ConfirmDialog);
app.component('RadioButton', RadioButton);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('OverlayPanel', OverlayPanel);
app.component('Dialog', Dialog);

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err);
  console.error('Component:', vm);
  console.error('Info:', info);

  // You could also send errors to a logging service here
};

// Global properties
app.config.globalProperties.$appName = 'CrewLink';
app.config.globalProperties.$appVersion = '1.0.0';

// Mount app
app.mount('#app');
