import * as React from 'react';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router';
import { AppState, GPDispatch } from '../Store/State';
import { addToHistory } from '../Store/History';
import { fetchPlaceDetails } from '../Store/Sagas';
import { Place } from '../Store/Place';
import PlaceDetails from '../Place/PlaceDetails';
import Page from '../Page';

interface PlacePageProps {
   id: number;
   place: Place|undefined;
   dispatch: GPDispatch;
}

class PlacePageConnected extends React.PureComponent<PlacePageProps> {
   componentWillMount() {
      this.calculateData(this.props);
   }

   componentWillReceiveProps(nextProps: PlacePageProps) {
      if (nextProps.id !== this.props.id) {
         this.calculateData(nextProps);
      }
      nextProps.dispatch(addToHistory({place: nextProps.place}));
   }

   calculateData(props: PlacePageProps) {
      if (props.id >= 0) {
         props.dispatch(fetchPlaceDetails.request({id: props.id}));
      }
   }

   render() {
      const p = this.props.place;
      window.console.log(p, this.props.id);
      document.title = p ? p.name : 'Place';
      return (
         <Page
            decujus={undefined}
            main={ (p || this.props.id < 0) ?
               <PlaceDetails place={p} /> :
               <Loader active={true} size="large">Loading</Loader>
            }
         />
      );
   }
}

interface PropsFromRoute {
   id: string;
}

const PlacePage = connect(
   (state: AppState, ownProps: RouteComponentProps<PropsFromRoute>) => {
      const id = Number(ownProps.match.params.id);
      window.console.log('Places=', state.places);
      return {
         id,
         place: state.places[id] as Place | undefined,
      };
   },
   (dispatch: GPDispatch) => ({
      dispatch,
   }),
)(PlacePageConnected);

export default PlacePage;
