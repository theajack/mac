/*
 * @Author: chenzhongsheng
 * @Date: 2024-04-30 15:40:34
 * @Description: Coding something
 */
// /*
//  * @Author: chenzhongsheng
//  * @Date: 2024-01-06 22:12:46
//  * @Description: Coding something
//  */

// declare function ICreateSingleStore<T>(): T[];
// declare function ICreateSingleStore<T>(id: number): (()=>T);

// export function createAppDataStore<T> (
//     createSingleStore: typeof ICreateSingleStore<T>
// ) {
//     const storeMap: Record<number, ()=>T> = {};

//     return (id?: number) => {

//         if (typeof id === 'undefined') {
//             const stores: T[] = [];
//             for (const key in storeMap) {
//                 stores.push(storeMap[key]());
//             }
//             return stores;
//         }

//         if (storeMap[id]) return storeMap[id]();

//         const useStore = createSingleStore(id);

//         storeMap[id] = useStore;

//         return useStore();
//     };
// }


/*
 * @Author: chenzhongsheng
 * @Date: 2024-01-06 22:12:46
 * @Description: Coding something
 */
export function createAppDataStore<T> (
    createSingleStore: (id: number) => (()=>T)
) {
    const storeMap: Record<number, ()=>T> = {};
    function useStoreFn (id: number): T {

        if (typeof id !== 'number') throw new Error('id must be a number');

        if (storeMap[id]) return storeMap[id]();

        const useStore = createSingleStore(id);

        storeMap[id] = useStore;

        return useStore();
    }

    useStoreFn.remove = (id: number) => {
        delete storeMap[id];
    };
    useStoreFn.all = () => {
        const stores: T[] = [];
        for (const key in storeMap) {
            stores.push(storeMap[key]());
        }
        return stores;
    };
    useStoreFn.map = storeMap;

    return useStoreFn;
}