import path from "path";
import fsPromises from "fs/promises";
import Woning from "../../features/woning";

export async function getStaticPaths() {
    const filePath = path.join(process.cwd(), 'data/data.json');
    const jsonData = await fsPromises.readFile(filePath);
    const woningen = JSON.parse(jsonData);

    // Get the paths we want to pre-render based on posts
    const paths = woningen.woningen.map((woning) => ({
        params: {id: woning.id},
    }))

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return {paths, fallback: false}
}

export async function getStaticProps({params}) {
    const filePath = path.join(process.cwd(), 'data/data.json');
    const jsonData = await fsPromises.readFile(filePath);
    const woningen = JSON.parse(jsonData);
    const woning = woningen.woningen.find((woning) => woning.id === params.id)
    console.log(woning);
    return {
        props: woning
    };
}

const woning = (woning) => {
    return <Woning woning={woning}></Woning>;
}

export default woning
