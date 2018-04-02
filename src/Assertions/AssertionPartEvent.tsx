import * as React from 'react';
import { connect } from 'react-redux';
import { AppState, GPDispatch } from '../Store/State';
import { fetchEventDetails } from '../Store/Sagas';
import { Loader, Rating } from 'semantic-ui-react';
import { PersonaLink, SourceLink, PlaceLink } from '../Links';
import { GenealogyEvent } from '../Store/Event';
import AssertionPart from '../Assertions/AssertionPart';
import { P2E } from '../Store/Assertion';

/**
 * Brief details for an event
 */

interface EventDetailsProps {
   event?: GenealogyEvent;
}

function EventDetails(props: EventDetailsProps) {
   if (props.event === undefined || props.event.asserts === undefined) {
      return <Loader active={true} size="small">Loading</Loader>;
   }
   return (
      <table className="eventDetails">
         <tbody>
         {
            props.event.asserts.get().map((a, idx) => {
               if (a instanceof P2E) {
                  return [
                     <tr key={idx}>
                        <td>{a.role}</td>
                        <td className="name">
                           <PersonaLink id={a.personId} />
                        </td>
                        <td><SourceLink id={a.sourceId} /></td>
                        <td>
                           <Rating
                              style={{float: 'right'}}
                              rating={1}   /* ??? Incorrect */
                              size="mini"
                              maxRating={5}
                           />
                        </td>
                     </tr>,
                     a.rationale ? <tr key={'rat' + idx}><td/><td colSpan={3}>{a.rationale}</td></tr> : null,
                  ];
               } else {
                  return <span key={idx}>Unknown assertion</span>;
               }
            })
            
         }
         </tbody>
      </table>
   );
}

/**
 * Event Part
 * One of the two components of an assertion, an event
 */

interface EventProps {
   eventId: number;
}
interface ConnectedEventProps extends EventProps {
   event: GenealogyEvent;
   dispatch: GPDispatch;
}

class ConnectedAssertionPartEvent extends React.PureComponent<ConnectedEventProps> {
   onExpand = () => {
      this.props.dispatch(fetchEventDetails.request({id: this.props.event.id}));
   }
   
   render() {
      const e = this.props.event;
      return (
         <AssertionPart
            title={
               <div>
                  <div className="dateAndTag">
                     <div>{e.date && <span title={e.date_sort}>{e.date}</span>}</div>
                     <div>{e.type ? e.type.name : 'Unknown'}</div>
                  </div>
                  <div
                     className={'nameAndPlace ' + (e.name || e.placeId ? 'bordered ' : '')}
                  >
                     <div>{e.name}</div>
                     <div>{e.placeId && <PlaceLink id={e.placeId} />}</div>
                  </div>
               </div>
            }
            expandable={true}
            expanded={<EventDetails event={e}/>}
            onExpand={this.onExpand}
         />
      );
   }
}

const AssertionPartEvent = connect(
   (state: AppState, props: EventProps) => ({
      ...props,
      event: state.events[props.eventId],
   }),
   (dispatch: GPDispatch) => ({
      dispatch,
   }),
)(ConnectedAssertionPartEvent);
export default AssertionPartEvent;
