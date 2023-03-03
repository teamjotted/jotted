import axios from "axios";
import cookie from "cookiejs";
import { getSession } from "next-auth/react";
import { BASE_URL, STRIPE_URL } from "./config";
import { toast } from "react-toastify";

export async function stripeConnect(id) {
  const { token } = await getSession();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    return await axios
      .post(STRIPE_URL + "/connect", { user_id: id }, { headers })
      .then((res) => {
        console.log(res);
        return res;
      });
  } catch (error) {
    throw error.response;
  }
}

export async function stripePurchase(user_id, tree_id) {
  const { token } = await getSession();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    return await axios
      .post(BASE_URL + "/purchases", { user_id, tree_id }, { headers })
      .then((res) => {
        return res.data;
      });
  } catch (error) {
    throw error.response;
  }
}

export async function stripeVerifyPurchase(user_id, tree_id) {
  const { token } = await getSession();
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    return await axios
      .get(
        BASE_URL + `/purchase_verify?user_id=${user_id}&tree_id=${tree_id}`,
        { headers }
      )
      .then((res) => {
        console.log(res);
        return res.data;
      });
  } catch (error) {
    throw error.response;
  }
}

//api

// let authToken = cookie.get('j_ce_u') || '';

export async function createUser(payload) {
  try {
    return await axios.post(BASE_URL + "/auth/signup", payload).then((res) => {
      console.log(res);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function verifyNewUser(payload) {
  try {
    return await axios.post(BASE_URL + "/verify_otp", payload).then((res) => {
      console.log(res);
      return res.data;
    });
  } catch (error) {
    toast.error("User already exist, please try again!");
    console.log(error);
  }
}

export async function deleteTree(id) {
  // const headers = {
  // 	Accept: 'application/json',
  // 	'Content-Type': 'application/json'
  // 	// Authorization: `Bearer ${localStorage.token}`,
  // };

  try {
    return await axios.delete(BASE_URL + "/tree/" + id).then((res) => {
      console.log(res);
      toast.info("Tree Deleted");
      return res;
    });
  } catch (error) {
    toast.error("Unable to save your tree.");
    throw error.response;
  }
}

export async function saveUserTree(id, edit) {
  // const headers = {
  // 	Accept: 'application/json',
  // 	'Content-Type': 'application/json'
  // 	// Authorization: `Bearer ${localStorage.token}`,
  // };

  try {
    return await axios.post(BASE_URL + "/tree/" + id, edit).then((res) => {
      toast.success("Tree saved!");

      return res.data;
    });
  } catch (error) {
    toast.error("Unable to save your tree.");
    throw error.response;
  }
}

export async function saveUserTreePrivacy(id, edit) {
  // const headers = {
  // 	Accept: 'application/json',
  // 	'Content-Type': 'application/json'
  // 	// Authorization: `Bearer ${localStorage.token}`,
  // };

  try {
    return await axios.post(BASE_URL + "/tree_privacy", edit).then((res) => {
      return res.data;
    });
  } catch (error) {
    toast.error("Unable to save your tree.");
    throw error.response;
  }
}
export async function getUserById(id) {
  try {
    return await axios.get(BASE_URL + `/user/${id}`).then((res) => {
      console.log(res.data.email);
      return res.data;
    });
  } catch (e) {
    console.log(e);
  }
}

export async function getNodeByTreeId(treeid) {
  try {
    const response = await fetch(
      `https://xg3n-4mh1-ngd5.n7.xano.io/api:w4ONEGEJ:v2/naufeltree-details/${treeid}`
    );
    const json = await response.json();
    // dispatch(
    //   setNodes(
    //     json.map((obj) => ({
    //       ...obj,
    //       data: { label: obj.label, photo: obj.photo },
    //     }))
    //   )
    // );
    return json;
  } catch (error) {
    console.log("error", error);
  }
}

export async function editNodeDetails(node_id, label, photo) {
  try {
    return await axios
      .post(BASE_URL + `/naufeltree-details`, {
        node_id,
        label,
        photo,
      })
      .then((res) => {
        console.log(res);
        return res;
      });

    //dispatch(setNodes(json.map((obj) => ({ ...obj, data: { label: obj.label, photo: obj.photo } }))));
    return json;
  } catch (error) {
    console.log("error", error);
  }
}

export async function getNodeEdges(treeid) {
  try {
    return await axios
      .get(
        `https://xg3n-4mh1-ngd5.n7.xano.io/api:w4ONEGEJ:v2/edges-details/${treeid}`
      )
      .then((res) => {
        return res.data;
      });
  } catch (error) {
    console.log(error);
  }
}

export async function createNodeEdge(edge, treeid) {
  try {
    return await axios.post(BASE_URL + "/edges", edge).then((res) => {
      console.log(res, treeid);
      // getNodeEdges(treeid);
    });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteNodeEdge(id) {
  try {
    return await axios.delete(BASE_URL + "/edges/" + id).then((res) => {
      return res.data;
    });
  } catch (error) {
    console.log(error);
  }
}
export async function createTree(payload) {
  try {
    return await axios.post(BASE_URL + "/tree", payload).then((res) => {
      console.log(res.data);
      return res.data;
    });
  } catch (error) {
    throw error;
  }
}

export async function getTreeById(id) {
  try {
    return await axios.get(BASE_URL + `/tree/${id}`);
  } catch (e) {
    throw e;
  }
}
export async function getMyTrees() {
  const { token } = await getSession();
  console.log(token);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    return await axios.get(BASE_URL + `/my_trees`, {
      headers,
    });
  } catch (e) {
    throw e;
  }
}

export async function getMyPurchasedTrees() {
  const { token } = await getSession();
  console.log(token);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    return await axios.get(BASE_URL + `/my_purchased`, {
      headers,
    });
  } catch (e) {
    throw e;
  }
}
export async function getTreesByUserId(id) {
  // const headers = "yes";

  try {
    return await axios
      .get(BASE_URL + `/user_trees?user_id=${id}`)
      .then((res) => {
        return res.data;
      });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getPublicTrees(page, per_page, offset, filter) {
  try {
    return await axios
      .get(
        BASE_URL +
          `/public_trees?page=${page}&per_page=${per_page}&offset=${offset}&filter=${filter}`
      )
      .then((res) => {
        return res.data;
      });
  } catch (e) {
    console.log(e);
    throw e;
  }
}
export async function getSearchTrees(page, per_page, offset, search_query) {
  try {
    return await axios
      .get(
        BASE_URL +
          `/search?search_query=${search_query}&page=${page}&per_page=${per_page}&offset=${offset}`
      )
      .then((res) => {
        return res.data;
      });
  } catch (e) {
    console.log(e);
    throw e;
  }
}
export async function getMySharedTrees() {
  const { token } = await getSession();
  try {
    return await axios
      .get(BASE_URL + `/shared/my_trees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        return res;
      });
  } catch (e) {
    console.log(e);
  }
}
export async function shareMyTree(invited, tree_id) {
  const { token } = await getSession();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  console.log(invited);
  try {
    return await axios
      .post(
        BASE_URL + `/share`,
        { shared_users: invited, tree_id },
        { headers }
      )
      .then((res) => {
        console.log(res);
        return res;
      });
  } catch (err) {
    console.log(err);
  }
}

export async function priceMyTree(tree_id, price) {
  const { token } = await getSession();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    return await axios
      .post(BASE_URL + `/tree_price`, { tree_id, price }, { headers })
      .then((res) => {
        return res;
      });
  } catch (err) {
    console.log(err);
  }
}

export async function getUserPurchases(id) {
  const { token } = await getSession();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    return await axios
      .get(BASE_URL + `/purchases?user_id=${id}`, { headers })
      .then((res) => {
        return res.data;
      });
  } catch (err) {
    console.log(err);
  }
}

export async function getUserEmail(email) {
  const headers = {
    Authorization: `Bearer ${cookie.get("j_ce_u") || ""}`,
  };
  try {
    return await axios
      .get(
        `https://xg3n-4mh1-ngd5.n7.xano.io/api:w4ONEGEJ:v2/user_by_email?email=${email}`,
        {
          headers,
        }
      )
      .then((res) => {
        console.log(res.data);
        // toast.success(`Sharing your tree to ${res.data[0].firstname}`);
        return res.data;
      });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

export async function getUserResources(user_id, page, per_page, offset) {
  try {
    return await axios
      .get(
        BASE_URL +
          `/user_resources?user_id=${user_id}&page=${page}&per_page=${per_page}&offset=${offset}`
      )
      .then((res) => {
        console.log(res.data);
        // toast.success(`Sharing your tree to ${res.data[0].firstname}`);
        return res.data;
      });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
export async function deleteNode(id, treeid) {
  try {
    return await axios.delete(BASE_URL + `/naufeltree/${id}`).then((res) => {
      console.log(res);
      getNodeByTreeId(treeid);

      return res.data;
    });
  } catch (e) {
    console.log(e);
  }
}
export async function createNode(node) {
  try {
    return await axios.post(BASE_URL + `/naufeltree`, node).then((res) => {
      getNodeByTreeId(res.data.tree_id);
      return res.data;
    });
  } catch (error) {
    console.log(error);
  }
}
export async function editUser(id, payload) {
  try {
    return await axios.post(BASE_URL + `/user/${id}`, payload).then((res) => {
      //getNodeByTreeId(dispatch, treeid);
      //getNodeEdges(dispatch, treeid);
      return res.data;
    });
  } catch (error) {
    console.log(error);
  }
}

export async function editNode(id, node, treeid, dispatch) {
  try {
    return await axios
      .post(BASE_URL + `/naufeltree/${id}`, node)
      .then((res) => {
        //getNodeByTreeId(dispatch, treeid);
        //getNodeEdges(dispatch, treeid);
        return res.data;
      });
  } catch (error) {
    console.log(error);
  }
}

export async function orderNodes(payload) {
  try {
    return await axios
      .post(BASE_URL + "/nodes_order", { nodes: payload })
      .then((res) => {
        console.log(res);
        // getNodeAttachments(res.data.node_id, dispatch);
        return res.data;
      });
  } catch (error) {
    console.log(error);
  }
}

export async function createNodeAttacments(payload, dispatch) {
  try {
    return await axios.post(BASE_URL + "/resources", payload).then((res) => {
      console.log(res);
      getNodeAttachments(res.data.node_id, dispatch);
      return res.data;
    });
  } catch (error) {
    console.log(error);
  }
}

export async function orderResource(payload) {
  console.log(payload);
  try {
    return await axios
      .post(BASE_URL + "/resources_order", {
        resource: payload,
      })
      .then((res) => {
        console.log(res);
        // getNodeAttachments(res.data.node_id, dispatch);
        return res.data;
      });
  } catch (error) {
    console.log(error);
  }
}
export async function getNodeAttachments(id) {
  // const headers = {
  // 	Accept: 'application/json',
  // 	'Content-Type': 'application/json'
  // 	// Authorization: `Bearer ${localStorage.token}`,
  // };
  try {
    return await axios.get(
      BASE_URL +
        `/node_attatchments-details?${id ? `node_id=${id}` : `tree_id=${id}`}`
    );
  } catch (error) {
    console.log("ERROR:", error);
  }
}
export async function editNodeAttachments(id, attachment) {
  try {
    return await axios.post(BASE_URL + `/resources/${id}`, attachment);
  } catch (error) {
    console.log("ERROR:", error);
  }
}
export async function addNodeAttachments(attachment) {
  try {
    return await axios.post(BASE_URL + `/resources`, attachment);
  } catch (error) {
    console.log("ERROR:", error);
  }
}
export async function deleteNodeAttachments(id) {
  try {
    return await axios.delete(BASE_URL + `/resources/${id}`);
  } catch (error) {
    console.log("ERROR:", error);
  }
}
export async function getNodeDetailsById(id) {
  // const headers = {
  // 	Accept: 'application/json',
  // 	'Content-Type': 'application/json'
  // 	// Authorization: `Bearer ${localStorage.token}`,
  // };
  try {
    return await axios.get(BASE_URL + `/naufeltree/${id}`);
  } catch (error) {
    console.log("ERROR:", error);
  }
}
export async function getTags() {
  try {
    return await axios.get(BASE_URL + `/tags`);
  } catch (error) {
    console.log(error);
  }
}
export async function addTreeTags(tags, id) {
  console.log(tags, id);
  try {
    return await axios.patch(BASE_URL + `/tree_tags`, {
      tags: tags,
      tree_id: id,
    });
  } catch (error) {
    console.log(error);
  }
}
export async function userVisit(tree_id, user_id) {
  try {
    return await axios.patch(BASE_URL + `/user_visit`, {
      tree_id,
      user_id,
    });
  } catch (error) {
    console.log("ERROR:", error);
  }
}

export async function saveFlaschards(
  resources_id,
  user_id,
  is_public,
  name,
  flashcards
) {
  try {
    return await axios.post(BASE_URL + `/flashcards`, {
      resources_id,
      user_id,
      public: is_public,
      name,
      flashcards,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getMyFlaschards(id) {
  try {
    return await axios.get(BASE_URL + `/myflashcards?user_id=${id}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getFlaschards() {
  try {
    return await axios.get(BASE_URL + `/public_flashcards`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//OPEN AI API
export async function generateFlaschards(user_input) {
  console.log(user_input);
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `We are creating flashcards from the infomation below:\n${user_input}\nCreate 5 key terms from above:\n1.`,
    temperature: 0,
    max_tokens: 200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const ansewerPrompt = `${response.data.choices[0].text}\nDefine the 5 key terms:\n1.`;

  const answers = await openai
    .createCompletion({
      model: "text-davinci-002",
      prompt: ansewerPrompt,
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 1.5,
    })
    .then((res) => {
      return res;
    });
  // console.log(response);
  // console.log(answers);
  console.log(
    `We are creating flashcards from the infomation below:\n${user_input}\nList 5 key words from above:\n1.`,
    response.data.choices[0].text,
    `\nDefine the vocabulary words:\n1.`,
    answers.data.choices[0].text
  );
  return {
    questions: "\n1." + response.data.choices[0].text,
    answers: "\n1." + answers.data.choices[0].text,
  };
}

export async function createReaction(user_id, resource_id, type) {
  console.log(user_id, resource_id, type);
  try {
    return await axios.post(BASE_URL + `/reactions`, {
      user_id,
      resource_id,
      type,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
