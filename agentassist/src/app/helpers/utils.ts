declare const $: any;

export const clone = (data) => {
    if ($.isArray(data)) {
        return $.extend(true, [], data)
    } else {
        return $.extend(true, {}, data)
    }
}


export const convertToContextVars = (obj: Object) => {

    return Object.keys(obj).map((key) => {
        return {
            Name: key,
            Description: "",
            Type: typeof obj[key],
            Children: (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) ? convertToContextVars(obj[key]) : []
        }
    })

}
