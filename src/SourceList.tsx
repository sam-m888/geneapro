import * as React from 'react';
import { connect } from 'react-redux';
import 'fixed-data-table/dist/fixed-data-table.css';
import Page from './Page';
import { AppState, GPDispatch } from './Store/State';
import { Input, Segment } from 'semantic-ui-react';
import { Source, SourceSet } from './Store/Source';
import { SourceLink } from './Links';
import { Table, CellProps, Column, Cell } from 'fixed-data-table';
import { fetchSources } from './Store/Sagas';

interface SourceListProps {
   allSources: SourceSet;
   dispatch: GPDispatch;
}

interface SourceListState {
   filter?: string;
   sources: Source[];
}

class SourceListConnected extends React.PureComponent<SourceListProps, SourceListState> {
   constructor() {
      super();
      this.state = {
         filter: '',
         sources: [],
      };
   }

   componentWillReceiveProps(nextProps: SourceListProps) {
      if (nextProps.allSources !== this.props.allSources) {
         this.setState((s: SourceListState) => ({
            ...s,
            sources: this.computeSources(nextProps.allSources, s.filter),
         }));
      }
   }

   componentWillMount() {
      this.props.dispatch(fetchSources.request({}));
   }

   computeSources(set: SourceSet, filter?: string): Source[] {
      let list = Object.entries(set)
         .map(
            ([key, val]: [string, Source]) => val).sort(
            (p1: Source, p2: Source) => p1.title.localeCompare(p2.title));

      if (filter) {
         list = list.filter(
            (p: Source) => p.title.toLowerCase().indexOf(filter) >= 0
         );
      }

      return list;
   }

   filterChange = (e: React.FormEvent<HTMLElement>, val: {value: string}) => {
      this.setState({
         filter: val.value,
         sources: this.computeSources(this.props.allSources, val.value),
      });
   }

   render() {
      const width = 900;
      document.title = 'List of sources';

      const sources = this.state.sources;

      return (
         <Page
            main={
               <div className="SourceList">
                  <Segment
                     style={{width: width}}
                     color="blue"
                     attached={true}
                  >
                     <span>
                        {sources.length} / {Object.keys(this.props.allSources).length} Sources
                     </span>
                     <Input
                        icon="search"
                        placeholder="Filter..."
                        onChange={this.filterChange}
                        style={{position: 'absolute', right: '5px', top: '5px'}}
                     />
                  </Segment>
                  <Table
                     rowHeight={30}
                     rowsCount={sources.length}
                     width={width}
                     height={600}
                     footerHeight={0}
                     headerHeight={30}
                  >
                     <Column
                             header={<Cell>Name</Cell>}
                             cell={({rowIndex, ...props}: CellProps) => {
                                const p: Source = sources[rowIndex as number];
                                return (
                                   <Cell {...props}>
                                      <SourceLink
                                          id={p.id}
                                          name={p.title}
                                      />
                                   </Cell>
                                );
                             }}
                             isResizable={false}
                             width={width}
                     />
                  </Table>
               </div>
            }
         />
      );
   }
}

const SourceList = connect(
   (state: AppState) => ({
      allSources: state.sources,
   }),
   (dispatch: GPDispatch) => ({
      dispatch
   }),
)(SourceListConnected);
export default SourceList;