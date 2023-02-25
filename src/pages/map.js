import Map from '../features/map';
import {loadData} from "../lib/load-data";

export async function getStaticProps() {
    const woningen = await loadData()
    return { props: { woningen } }
}
const map = ({woningen}) => {
    return <Map woningen={woningen} />;
};

export default map;