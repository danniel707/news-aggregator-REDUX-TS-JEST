import { initializeApp } from 'firebase/app';
import {
	getAuth,
	//signInWithRedirect,
	signInWithPopup,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	NextOrObserver,
	User,
	updateProfile,
	UserCredential
} from 'firebase/auth';

import {
	getFirestore,
	doc,
	query,
	where,
	getDoc,
	setDoc,//completely overwrite a document with new data
	addDoc,
	updateDoc, //update specific fields of a document without overwriting the entire document
	
	collection, 
	getDocs,
	deleteDoc,
	QueryDocumentSnapshot
} from 'firebase/firestore'

import { Post } from '../../store/posts/posts.types';

const firebaseConfig = {
  apiKey: "AIzaSyDAaNGtNG_53S0p9vGjJK4_Ttqb111o1jQ",
  authDomain: "news-blog-db.firebaseapp.com",
  projectId: "news-blog-db",
  storageBucket: "news-blog-db.appspot.com",
  messagingSenderId: "578427641459",
  appId: "1:578427641459:web:8f1368315785cc00615406"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
	prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => 
	signInWithPopup(auth, googleProvider);
export const db = getFirestore(firebaseApp);

export type AdditionalInformation = {
	displayName?: string;
	role: string;
}

export type UserData = {
	uid: string;
	createdAt: Date;
	displayName: string;
	email: string;
	role: string;
}

export const createUserDocumentFromAuth = async (
	userAuth: User, 
	additionalInformation = {} as AdditionalInformation
	): Promise<void | QueryDocumentSnapshot<UserData>> => {
	if(!userAuth) return;
	
	const userDocRef = doc(db, 'users', userAuth.uid);	
	const userSnapshot = await getDoc(userDocRef);
	
	if(!userSnapshot.exists()){
		const {displayName, email } = userAuth;		
		const createdAt = new Date();
		
		try{
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
				...additionalInformation,
			});
		} catch (error) {
			console.log('error creating the user', error);
		}
	}
	return userSnapshot as QueryDocumentSnapshot<UserData>;
}

export const createAuthUserWithEmailAndPassword = async (
	email: string, 
	password: string, 
	additionalInformation = {} as AdditionalInformation
	): Promise<UserCredential | null> => {
	  if (!email || !password) return null;
	 
	  const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
	  
	  if (userCredential && additionalInformation.displayName) {
	  	const { user } = userCredential;		  
	    await updateProfile(user, {
	      displayName: additionalInformation.displayName
	    });
	  }

	  return userCredential;	 
	};

export const signInAuthUserWithEmailAndPassword = async (email: string, password: string) => {
	if(!email || !password) return;

	return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback: NextOrObserver<User>) => 
	onAuthStateChanged(auth, callback)

export const fetchUser = async (userId: string) => {
	try {
        //Reference to the specific user document
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
       	
        const user = userDoc.data(); // Access the document data
 			  return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error; // Re-throw the error to handle it in the calling code
    }
}

export const createPostDocument = async (
	newPostData: object, 
	) => {
	try {			
		const postsCollectionRef = collection(db, 'posts');
		const postDocRef = await addDoc(postsCollectionRef, newPostData); 
		const postDoc = await getDoc(postDocRef); 
		const post = {
			  id: postDoc.id,
			  ...postDoc.data()
		} as Post;
    return post;
	} catch (error) {
		console.error('Error adding post:', error);
	} 	
}

export const editPostDocument = async (post: Post) => {
	try {

		const postDocRef = doc(db, 'posts', post.id);
		await updateDoc(postDocRef, post); 

		return post;
	} catch (error) {    
		console.error('Error adding post:', error);
	}	
}

export const fetchPosts = async (): Promise<Post[]> => {

	try {
    const postsCollectionRef = collection(db, 'posts'); // Reference to the 'posts' collection
		const q = query(postsCollectionRef); // Construct a query
		const querySnapshot = await getDocs(q); // Fetch all documents based on the constructed query 
    
    const postData = querySnapshot.docs.map((doc) =>({
    	...doc.data() as Post,
    	id: doc.id	
    })) ;
    // Sort postData by createdAt field in descending order
    postData.sort((a, b) => b.createdAt - a.createdAt);
    return postData;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export const fetchPost = async (postId: string) => {			
	try {
        //Reference to the specific post document
        const postDocRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postDocRef);
        
        const post = postDoc.data(); // Access the document data
 
        return post;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error; // Re-throw the error to handle it in the calling code
    }
}

export const deletePost = async (postId: string) => {
	try {
		// Delete comments related to the post
    const commentsQuerySnapshot = await getDocs(query(collection(db, 'postComments'), where('postId', '==', postId)));
    commentsQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    // Delete likes related to the post
    const likesQuerySnapshot = await getDocs(query(collection(db, 'postLikes'), where('postId', '==', postId)));
    likesQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });      // Delete post from Firestore database
    
    await deleteDoc(doc(db, 'posts', postId));
		
    } catch (error) {
      console.error('Error deleting post:', error);
    }	
}

type likeBtnFields = {
	postId: string;
	userId: string;
}

export const fetchIfPostLiked = async (fields: likeBtnFields): Promise<boolean> => {
	try {

      const postLikesCollectionRef = collection(db, 'postLikes');
      const postLikeQuery = query(
          postLikesCollectionRef,
          where('postId', '==', fields.postId),
          where('userId', '==', fields.userId)
      );
      const querySnapshot = await getDocs(postLikeQuery);
      
      // Check if any documents exist in the query results
      return !querySnapshot.empty;
  } catch (error) {
      console.error('Error fetching post likes:', error);
      throw error;
  }
}

export const getPostLikesQuantity = async (postId: string): Promise<number> => {
  try {
    // Reference to the likes collection for the specific post
    const likesCollectionRef = collection(db, 'postLikes');
    const postLikesQuery = query(likesCollectionRef, where('postId', '==', postId));

    // Fetch all likes documents for the specified post ID
    const querySnapshot = await getDocs(postLikesQuery);
   
    // Return the number of likes
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting post likes quantity:', error);
    throw error; // Re-throw the error to handle it in the calling code
  }
};

const postLikes = async (fields: likeBtnFields, liked: boolean) => {
	try {

		const postLikesCollectionRef = collection(db, 'postLikes');	
		if (!liked) {
				await addDoc(postLikesCollectionRef, fields);	
		}	else {				
				const postLikeQuery = query(postLikesCollectionRef, where('postId', '==', fields.postId), where('userId', '==', fields.userId));
				const postLikeDocs = await getDocs(postLikeQuery);
     			postLikeDocs.forEach(doc => {
        	deleteDoc(doc.ref);
      	});     
		}	
	} catch (error) {
		console.log('Error at postLikes', error);
		throw error; 
	}	 	
}

export const sumLike = async (liked:boolean, fields: likeBtnFields) => {
    try {
    	 	
        // Reference to the specific post document
        const postDocRef = doc(db, 'posts', fields.postId);							
       	postLikes(fields, liked)//Acumulate the users likes per post
     		    
    } catch (error) {
        console.error('Error updating likes:', error);
        throw error; // Re-throw the error to handle it in the calling code
    }
};

export type CommentFields = {
	id: string;
	postId: string;
	userId: string;
	comment: string;
	createdAt: number;
}

export const saveComment = async (fields: object): Promise<CommentFields> => {
	try {
		
		 const commentDocRef = collection(db, 'postComments');
		 const newPostCommentRef = await addDoc(commentDocRef, fields);
		 const commentDoc = await getDoc(newPostCommentRef); 
		 const comment = {
			  id: commentDoc.id,
			  ...commentDoc.data()
		 } as CommentFields;
     return comment;
	}	catch (error) {
        console.error('Error saving comment:', error);
        throw error; // Re-throw the error to handle it in the calling code
    }
}

export const fetchComments = async (postId: string): Promise<CommentFields[]> => {

	try {
    const commentsCollectionRef = collection(db, 'postComments');
    const postCommentsQuery = query(commentsCollectionRef, 
    			where('postId', '==', postId),); // Reference to a specific document within the collection
      	
    const querySnapshot = await getDocs(postCommentsQuery); // Fetch all comments documents for the specified post ID
  	  
    const commentData = querySnapshot.docs.map((doc) => ({    	
      id: doc.id, // Document ID
      ...doc.data(), // Document data
    } as CommentFields));

    // Sort commentData by createdAt field in descending order
    commentData.sort((a, b) => b.createdAt - a.createdAt);
    return commentData;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export const getPostCommentsQuantity = async (postId: string): Promise<number> => {
  try {
    // Reference to the comments collection for the specific post
    const commentsCollectionRef = collection(db, 'postComments');
    const postCommentsQuery = query(commentsCollectionRef, where('postId', '==', postId));

    // Fetch all comments documents for the specified post ID
    const querySnapshot = await getDocs(postCommentsQuery);
   
    // Return the number of comments
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting post comments quantity:', error);
    throw error; // Re-throw the error to handle it in the calling code
  }
};

export const deletePostComment = async (commentId: string) => {
		try {			
      // Delete comment from Firestore database     
      await deleteDoc(doc(db, 'postComments', commentId));

    } catch (error) {
      console.error('Error deleting comment:', error);
    }	
}

