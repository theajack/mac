/*
 * @Author: chenzhongsheng
 * @Date: 2024-01-06 22:12:46
 * @Description: Coding something
 */
export function createAppDataStore<T> (
    createSingleStore: (id: number) => (()=>T)
) {
    const storeMap: Record<number, ()=>T> = {};

    return (id: number) => {

        if (storeMap[id]) return storeMap[id]();

        const useStore = createSingleStore(id);

        storeMap[id] = useStore;

        return useStore();
    };
}