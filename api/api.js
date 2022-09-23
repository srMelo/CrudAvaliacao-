let myHeaders = new Headers();

async function $get(url, token){
    const header = isAuth(token);
    if (header) myHeaders = header;

    const response = await fetch(url, {
        method:'GET',
        headers: myHeaders,
    });

    const responseData = await response.json();

    return responseData;
}

async function $delete(url, token, id){
    const header = isAuth(token);
    if (header) myHeaders = header;

    const response = await fetch(`${url}/${id}`,{
        method: 'DELETE',
        headers: myHeaders,
    });

    return response
}

async function $put(url, token, body, id){
    const header = isAuth(token);
    if (header) myHeaders = header;

    const response = await fetch(`${url}/${id}`,{
        method:"PUT",
        headers: myHeaders,
        body: JSON.stringify(body),
    })

    const responseData = await response.json();
    return responseData;
}


async function $post(url, token, body){
    try{
    const header = isAuth(token);
    if (header) myHeaders = header;

    const response = await fetch(url, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
    });

    const responseData = await response.json();
   
    if (responseData[0]) throw `${responseData[0].field}${responseData[0].message}`;
    return responseData;
    } catch (error) {
      throw error;
    }
}


function isAuth(token){
    if(token) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `Bearer ${token}`);

        return headers;
    }

    return null
}

export {$get, $post, $delete, $put}