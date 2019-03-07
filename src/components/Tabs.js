import { Tabs, Tab } from 'react-bootstrap';

Tabs.defaultProps = {
  ...Tabs.defaultProps,
  mountOnEnter: true,
  unmountOnExit: true,
  transition: false
};

export default Tabs;
export { Tab }