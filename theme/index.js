import { mode } from '@chakra-ui/theme-tools';
import { extendTheme } from '@chakra-ui/core';
const styles = {
  global: props => ({
    body: {
      color: mode('gray.100', 'black')(props),
      bg: mode('#21222D', '#F5F6FA')(props),
    },
  }),
};
const colors = {
  blue: {
    900: "#2B71FF",
    800: "#6095FF",
    700: "#4F5494"
  },
  yellow: {
    900: "#fad100"
  }
}
const components = {
};

const theme = extendTheme({
  components,
  styles,
  colors
});

export default theme;