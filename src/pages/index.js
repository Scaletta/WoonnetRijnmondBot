import Home from '../features/home/index';
import {loadData} from "../lib/load-data";

export async function getStaticProps() {
    const woningen = await loadData()
    return { props: { woningen } }
}
const HomePage = ({woningen}) => {
    return <Home woningen={woningen} />;
};

export default HomePage;