import component from "./component";
import "./main.scss";
import 'react';
import 'react-dom';
import { bake } from "./tree-shaking";

document.body.appendChild(component());
document.body.appendChild(bake());