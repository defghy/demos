module.exports = {
  "name": "socket-demo",
  "script": "src/index.js",
  "exec_mode": "cluster",
  "instances": 4,
  "max_memory_restart": "1G",
  "autorestart": false,
  "node_args": [],
  "args": [],
  "watch": "./",
  "watch_delay": 1000,
  "merge_logs": true,
  "log_date_format": "YYYY-MM-DD hh:mm:ss.SSS",
  "err_file": "/data/logs/kf_push/kf_push_error.log",
  "out_file": "/data/logs/kf_push/kf_push_out.log"
}
