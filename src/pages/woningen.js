import {Woningen} from '../features/woningen';
import {loadData} from "../lib/load-data";

export async function getStaticProps() {
    const woningen = await loadData()
    return { props: { woningen } }
}
const woningen = ({woningen}) => {
    return <Woningen woningen={woningen}/>;
};

export default woningen;