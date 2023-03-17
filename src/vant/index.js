import Vue from 'vue'

import {
  Calendar,
  Col,
  Row,
  Icon,
  List,
  Dialog,
  Toast,
  Form,
  Cell,
  CellGroup,
  Search,
  Button,
  Field,
  Radio,
  RadioGroup,
  DropdownMenu,
  DropdownItem,
  Picker,
  DatetimePicker,
  Popup,
  Collapse,
  CollapseItem,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  Divider,
  Empty,
  Switch ,
  Steps,
  Step,
  Panel,
  Image as VanImage
} from 'vant';

[
  Calendar,
  Col,
  Row,
  Icon,
  List,
  Dialog,
  Toast,
  Form,
  Cell,
  CellGroup,
  Search,
  Button,
  Field,
  Radio,
  RadioGroup,
  DropdownMenu,
  DropdownItem,
  Picker,
  DatetimePicker,
  Popup,
  Collapse,
  CollapseItem,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  Divider,
  VanImage,
  Empty,
  Switch,
  Steps,
  Step,
  Panel
].forEach(component=> {
  Vue.use(component);
})

Vue.prototype.$dialog = Dialog
Vue.prototype.$toast = Toast
Vue.prototype.$alert = (message)=>{
  Dialog.alert({
    message
  })
}
