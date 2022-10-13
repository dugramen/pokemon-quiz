
export async function cacheFetch(request: RequestInfo | URL, options?: any) {
    const cache = await caches.open('pokeapi');
    const response = await cache.match(request)
    if (response !== undefined) {
        console.log('existing request ', response)
        return response
    }
    else {
        console.log('new request ', request)
        await cache.add(request)
        return cache.match(request)
    }
}