import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
// We have some themes for you to choose, ex.
import "@milkdown/crepe/theme/frame.css";

// Or you can create your own theme
//import "./your-theme.css";

const crepe = new Crepe({
  root: "#app",
  defaultValue: "# Hello, Milkdown!",
});

crepe.create().then(() => {
  console.log("Milkdown is ready!");
});

// Before unmount
//crepe.destroy();
