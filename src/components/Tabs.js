import { Tabs, Tab } from 'react-bootstrap';

Tabs.defaultProps = {
  ...Tabs.defaultProps,
  transition: false
};

export default Tabs;
export { Tab }