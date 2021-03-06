import * as React from "react";
import { Accordion, Form } from "semantic-ui-react";
import { QuiltsSettings } from "../Store/Quilts";
import { SliderField } from "../Forms";

interface QuiltsSideProps {
   settings: QuiltsSettings;
   onChange: (diff: Partial<QuiltsSettings>) => void;
}

export default function QuiltsSide(props: QuiltsSideProps) {
   const panels = [
      {
         key: "theme",
         title: {
            content: (
               <span>
                  Theme
                  <small>
                     ancestors: {props.settings.ancestors}
                  </small>
               </span>
            )
         },
         content: {
            content: (
               <Form size="tiny">
                  <SliderField
                     defaultValue={props.settings.ancestors}
                     label="Ancestors"
                     fieldName="ancestors"
                     min={1}
                     max={60}
                     onChange={props.onChange}
                  />
               </Form>
            )
         }
      }
   ];

   return (
      <Accordion styled={true} exclusive={false} fluid={true} panels={panels} />
   );
}
