export REDDIS_UPLOADER__USER_AGENT=
export REDDIS_UPLOADER__CLIENT_ID=
export REDDIS_UPLOADER__CLIENT_SECRET=
export REDDIS_UPLOADER__USERNAME=
export REDDIS_UPLOADER__PASSWORD=
export REDDIS_UPLOADER__DATABASE_PATH=

export NODE_SERVER__FONTEND_PATH=
export NODE_SERVER__PORT=
export NODE_SERVER__SESSION_SECRET=
export NODE_SERVER_IS_DEV=
export NODE_SERVER__DATABASE_PATH=


alias start_dev="NODE_ENV=dev node src/backend/server/index.mjs"
alias start="node src/backend/server/index.mjs"
alias watch="npx gulp watch"
alias clean="npx gulp clean"
alias build="npx gulp build"
