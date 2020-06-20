const checkElemInContainerView = (_container, _elem, partial = false) => {
    let container = $(_container);
    let elem = $(_elem);
    let contHeight = container.height();
    // let contTop = container.scrollTop();
    // let contBottom = contTop + contHeight ;

    let elemTop = elem.offset().top - container.offset().top;
    let elemBottom = elemTop + elem.height();

    let isTotal = (elemTop >= 0 && elemBottom <=contHeight);
    let isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;

    return  isTotal  || isPart ;
};

export {
    checkElemInContainerView
}