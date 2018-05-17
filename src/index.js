import { sum } from "./scripts/sum";
import { curry } from "./scripts/curry";

document.body.append(curry(sum)(1, 2));
