export const createPipelines = fns => {
    return (data) => {
        return fns.reduce((lastResult, fn) => fn(lastResult) , data);
    }
};