import m from 'mithril';

const h = ({
  elementName,
  attributes,
  children,
}) => m(elementName, attributes, children);

export default h;
