import { ApolloClient, InMemoryCache, ApolloProvider, useSubscription, gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import Container from '@material-ui/core/Container';
import { Button, TextField } from '@material-ui/core';
import { WebSocketLink } from '@apollo/client/link/ws'


// Use for Subscription Queries
const link = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
    options: {
    reconnect: true
  }
});

  const client = new ApolloClient({
    link,
    uri: "http://localhost:4000/",
    cache: new InMemoryCache(),
  });
  
const Messages = ({ user }) => {
    const { data } = useSubscription(GET_MESSAGES, {
      
    })
    if(!data) {
        return null 
    }
    return (
      <>
      {data.messages.map(({ id, user: messageUser, content }) => (
        <div
          style={{
            display: "flex",
            justifyContent: user === messageUser ? "flex-end" : "flex-start",
            paddingBottom: "1em",
          }}
        >
          {user !== messageUser && (
            <div
              style={{
                height: 50,
                width: 50,
                marginRight: "0.5em",
                border: "2px solid #e5e6ea",
                borderRadius: 25,
                textAlign: "center",
                fontSize: "18pt",
                paddingTop: 5,
              }}
            >
              {messageUser.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div
            style={{
              background: user === messageUser ? "blue" : "#e5e6ea",
              color: user === messageUser ? "white" : "black",
              padding: "1em",
              borderRadius: "1em",
              maxWidth: "60%",
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </>
    )

}

const Chat = () => {
    const [state, setState] = useState({
        user: "Jack",
        content:"",
    })

    const [postMessage ] = useMutation(POST_MESSAGE)

    const onSend = () => {
     

        if (state.content.length > 0) {
            postMessage({
                variables: state
            })
    

        }

    }
    return(
       <div className="input__chat">
        <Messages user={state.user} />

          <TextField
            label="User"
            value={state.user}
            onChange={(evt) =>
              setState({
                ...state,
                user: evt.target.value,
              })
            }
          />


          <TextField
            label="Content"
            value={state.content}
            onChange={(evt) =>
              setState({
                ...state,
                content: evt.target.value,
              })
            }
          />

          <Button onClick={() => onSend()}> 
                Send
          </Button>
      
          </div>
    )
       
}

const GET_MESSAGES = gql `

subscription {
  messages {
    id
    content
    user
  }

  
}
`

const POST_MESSAGE = gql `
    mutation ($user: String!, $content:String!) {
    postMessage(user: $user, content: $content)
    }

`


export default () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
)