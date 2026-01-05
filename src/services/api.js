const BASE_URL = '' // H5 handles this via proxy or current origin

const request = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: (options.url.startsWith('http') ? '' : BASE_URL) + options.url,
            method: options.method || 'GET',
            data: options.data || {},
            header: {
                'Content-Type': 'application/json',
                ...options.header
            },
            success: (res) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data)
                } else {
                    const errorMsg = res.data?.message || `请求失败 (${res.statusCode})`;
                    uni.showToast({ title: errorMsg, icon: 'none' });
                    reject(res)
                }
            },
            fail: (err) => {
                uni.showToast({ title: '网络请求失败', icon: 'none' });
                reject(err)
            }
        })
    })
}

export const wallpapersService = {
    findAll: (params) => request({ url: '/api/wallpapers', data: params }),
    findOne: (id) => request({ url: `/api/wallpapers/${id}` }),
    toggleLike: (id, userId) => request({ url: `/api/wallpapers/${id}/like`, method: 'POST', data: { userId } }),
}

export const categoriesService = {
    findAll: () => request({ url: '/api/categories' }),
}

export const aiService = {
    generate: (data) => request({ url: '/api/ai/generate', method: 'POST', data }),
    getTasks: (userId) => request({ url: `/api/ai/tasks?userId=${userId}` }),
    getTask: (id) => request({ url: `/api/ai/task/${id}` }),
    deleteTasks: (ids) => request({ url: '/api/ai/delete-tasks', method: 'POST', data: { ids } }),
    submitToGallery: (id, data) => request({ url: `/api/ai/submit-to-gallery/${id}`, method: 'POST', data }),
}

export const tagsService = {
    findAll: () => request({ url: '/api/tags' }),
}
