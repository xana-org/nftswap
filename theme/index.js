import { mode } from '@chakra-ui/theme-tools';
import { extendTheme } from '@chakra-ui/core';
const styles = {
  global: props => ({
    body: {
      color: mode('gray.100', '#4F5494')(props),
      bg: mode('#21222D', '#F5F6FA')(props),
    },
  }),
};
const colors = {
}
const components = {
};

const theme = extendTheme({
  components,
  styles,
  colors
});

export default theme;