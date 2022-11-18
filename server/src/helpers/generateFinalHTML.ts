import { MarkerInput } from "../models/Hook";
import { json2html } from "html2json"

export default function generateFinalHtml(root: string, markers: MarkerInput[]) {

  let content = JSON.parse(root).child;
  try {
    for (const element of content) {

      if (element.child) {
        for (let i = 0; i < element.child.length; i++) {
          if (element.child[i].tag === "input") {
            const index = markers.findIndex(
              (marker) => marker.value === element.child[i].attr.value
            );
            let newInput = { node: "text", text: markers[index].input };
            element.child.splice(i, 1, newInput);
          }
        }
      }
    }
    return json2html({ node: "root", child: content });
  } catch (e) {
    console.log(e)
  }

}


