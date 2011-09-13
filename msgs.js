var msg = {
	filter:{},
	tmp:{
		ok: "Tmp database is ready",
		fail: "Tmp database fail",
		destroy: "Tmp was destroyed",
		notDestroy: "Tmp could not be destroyed"
	},
	backup: {
		ok:"Backup success",
		fail: "Sorry baby, your backup fail"
	},
	restore: {
		ok: "Yeah, your backup has been restored",
		fail: "Back could not possible restore your docs from backup"
	},
	clear: {
		ok: "Finally your trash docs has gone",
		fail: "Hey Brow, we found some problems to clean your database"
	},
	clearAll: {
		ok: "all docs removed"
	}
	
};
exports.msgs = msg;