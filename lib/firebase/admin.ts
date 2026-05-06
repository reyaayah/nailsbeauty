import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "nailsbeauty-978c5",
      clientEmail: "firebase-adminsdk-fbsvc@nailsbeauty-978c5.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtuAh/p9fAGDO9\nMc3ET6uK49co5A6KciiM7xFV8QDefKolVLl4mAeF5llQgPZNRSsLOYMYQ0u56AnL\nPzbWkvROYddvkdTTxgQhDM0wy5jvp3EAe704+XuBF7zj6dEvfl1Mqwy3xzPPpxb0\nJr9T9WZ2Ea+AgGivclszJXy7sVEJcvAZUuo3hRrnvbybKvqWbpj2pCaxdrY6t13w\n/zfGMmleAUSzLwWaTSpKe2TJcyCx3mKAP8gzOU7wTbc7Ongl7XT1wTEC/kzSy9mS\n9vZxjX9z9W7Gje5YDi+BpNHSerRKXpoxfcqJJJ+/XpsUpL27w4UMtNfybxpYWhB+\nJMLOpCbhAgMBAAECggEACDoOB/qbPmz+/UOXqKdzup/722NCd4a8uiDjt6fSSFcL\nyTkMEASWHZ6ZJfV3hJUFGvLaLRrZwhf1p8cKeiqrMG+Uf+N+ell3LlgAeyI3L8lE\nkhbqEQHKmiRVRQ9YgVjpAvWaRHVF9Dxn2z/fAXM+ixKfFrUuD/n4zPEmaS6WZX20\nh39FsZCbsDBHzEHJFPktQRjmadhfrP/4PKq/1EzEXVQCdOSWoI7qqPXTb0yjOuba\n6h1uZyRauIhYUrtxraG5/V6RUjcmklvjfA43RAFqVMa2fiKhijGlE/1hNOfx+lI1\ntOd9OSfkZ0xyvDcvaNUhNRiG0lV06ZSN5eZ7nMkwOQKBgQDnKvtYA3smMrfKCntZ\nQlID2o8+UgMwiI3D4gatpoTOeOlzuD+j3LSM5ko3wGPe8pulEMnbkDkpov2wdSkr\nzJOA++Ues0lWohFUBEhLb9vmZfOBAMUY5LrCD+Vvkr++PsJNeDz6/w2Zccmts94a\nrNYHTD5T9WyM8dGN1J7B9lSY2QKBgQDAYTpdxF8kJFk6C4Ip6/GW5DTelAgoM0JG\npTeJguizpIIK9DrCqGJAAkDrHsSAyu98wouV1jEUmRRHT6ufjHfvsxVfPEYcNFcu\nsh+nuEx++/XicYwxhxDMkYSObTUzs3CpzDK0qIG70Hxv3WU+ZSwIFG7kgZ8g1oTC\nV/9l+rZ5SQKBgQDN0FHZabgCKVPC+ZQaw1ZcAgJY3RHj6yA0z49cmg5R+gr3sYpP\nrRe+/uYDPzJr9BqpWwothvmt3WT670UJrumBBERZEgzwqfi9kdZ/+4aQWiLzryjM\nYhD46MhAjypSCnRaHvxECEMmY83I7oSHwWwJMVOo0rCjyETnfu8eB+AH+QKBgDya\n5K5BfM9/+/QDSCA4ykUE43rzG5a+fzSOO+7AJNrjCmy1AAXu0fTkQNtROApy4/tj\ntmGftpqMlwzYFnMO54HF4we7j0K3Yne9ead2sfKXIaESsF2x9SLc/Ot5j/cXonh7\nccXkB+rJBUqgbpK3gKWS+lRWWXEY433uBvFziCSxAoGAU0UXFbtckiR6JnKWVChV\nFwRQJpvTPQ0xyhW6XHRQmTSzaf0fy+lI0+CRZUQoiGcdPaEKZdj7GNMfydw1VIph\ntOI4ws2BuOaJEFmYJgJcvJpvOw1exZsaoM3y6wP+Lh/IkR88RGUqmqgH8MDVS7ZE\nuZ9DTbaMhgaVSP9MJce6OSs=\n-----END PRIVATE KEY-----\n",
    }),
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
