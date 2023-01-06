export function persistStorage(){
    // navigator persits storage
    if (navigator.storage) {
        navigator.storage.getDirectory().then((directory) => {
            console.log(directory.name);
            console.log(directory);
        });

        navigator.storage.estimate().then((estimate) => {
            console.log(estimate);
        });
        navigator.storage.persist().then((persisted) => {
            if (persisted) {
                console.log('Storage will not be cleared except by explicit user action');
            } else {
                console.log('Storage may be cleared by the UA under storage pressure.');
            }
        });
    }
}