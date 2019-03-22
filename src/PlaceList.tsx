import * as React from "react";
import { connect } from "react-redux";
import {
   List,
   ListRowRenderer
} from "react-virtualized";
import { Input, InputProps, Segment } from "semantic-ui-react";
import Page from "./Page";
import { AppState, GPDispatch } from "./Store/State";
import { Place, PlaceSet } from "./Store/Place";
import { useComponentSize, useDebounce } from "./Hooks";
import { PlaceLink } from "./Links";
import { fetchPlaces } from "./Store/Sagas";
import "./PlaceList.css";

interface PlaceListProps {
   allPlaces: PlaceSet;
   dispatch: GPDispatch;
}
const PlaceListConnected: React.FC<PlaceListProps> = p => {
   const container = React.useRef<HTMLDivElement>(null);
   const [filter, setFilter] = React.useState("");
   const [sorted, setSorted] = React.useState<Place[]>([]);
   const size = useComponentSize(container);

   React.useEffect(() => fetchPlaces.execute(p.dispatch, {}), [p.dispatch]);

   React.useEffect(() => {
      let list = Object.values(p.allPlaces);
      if (filter) {
         const lc_filter = filter.toLowerCase();
         list = list.filter(
            p2 => p2.name.toLowerCase().indexOf(lc_filter) >= 0
         );
      }
      setSorted(list.sort((p1, p2) => p1.name.localeCompare(p2.name)));
   }, [p.allPlaces, filter]);

   const onFilterChange = React.useCallback(
      useDebounce(
         (e: {}, val: InputProps) => setFilter(val.value as string),
         250
      ),
      []
   );

   const renderRow: ListRowRenderer = React.useCallback(
      ({ index, key, style }) => (
         <div style={style} key={key}>
            <PlaceLink id={sorted[index].id} />
         </div>
      ),
      [sorted]
   );

   document.title = "List of places";

   return (
      <Page
         main={
            <div className="PlaceList List" ref={container}>
               <Segment color="blue" attached={true}>
                  <span>
                     {sorted.length} / {Object.keys(p.allPlaces).length} Places
                  </span>
                  <Input
                     icon="search"
                     placeholder="Filter..."
                     onChange={onFilterChange}
                     style={{ position: "absolute", right: "5px", top: "5px" }}
                  />
               </Segment>
               <List
                  width={size.width}
                  height={size.height}
                  rowCount={sorted.length}
                  rowHeight={30}
                  overscanCount={5}
                  rowRenderer={renderRow}
               />
            </div>
         }
      />
   );
};

const PlaceList = connect(
   (state: AppState) => ({
      allPlaces: state.places
   }),
   (dispatch: GPDispatch) => ({
      dispatch
   })
)(PlaceListConnected);
export default PlaceList;
