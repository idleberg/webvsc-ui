/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "1ad62db186afffdce246"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/Users/jan/Dropbox/My Repositories/_visbot/webvsc-ui/assets";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _convert = __webpack_require__(1);

var _path = __webpack_require__(5);

var saveFile = function saveFile(text, filename) {
    var saveFile = document.getElementById("saveFile");
    saveFile.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    saveFile.setAttribute('download', filename);
    saveFile.removeAttribute('disabled');
};

var convertSingleFiles = function convertSingleFiles(file) {
    if (!file.name.endsWith('.avs')) return;

    var reader = new FileReader();

    reader.onload = function (e) {
        var data = reader.result;
        var preset = (0, _convert.convertPreset)(data, { verbose: 0 });

        saveFile(JSON.stringify(preset, null, 4), (0, _path.basename)(file.name, (0, _path.extname)(file.name)) + '.webvs');
    };

    reader.readAsArrayBuffer(file);
};

window.onload = function () {
    // Check File API support
    if (window.File && window.FileList && window.FileReader) {
        var loadFiles = document.getElementById("loadFiles");

        loadFiles.addEventListener("change", function (event) {
            var files = event.target.files;

            convertSingleFiles(files[0]);
        });
    } else {
        console.warn('Your browser does not support the File API (https://developer.mozilla.org/en-US/docs/Web/API/File)');
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
// Modules
var Components = __webpack_require__(2);
var Util = __webpack_require__(3);
var Table = __webpack_require__(4);
// Dependencies
// Constants
var sizeInt = 4;
var verbosity = 0; // log individual key:value fields
var componentTable = Components.builtin.concat(Components.dll);
var convertPreset = function convertPreset(data, args) {
    // TODO: globally manage default options
    args || (args = { verbose: 0 });
    verbosity = args.verbose ? args.verbose : 0;
    verbosity = args.quiet ? -1 : verbosity;
    Util.setVerbosity(verbosity);
    Util.setHiddenStrings(args.hidden);
    var preset = {};
    var blob8 = new Uint8Array(data);
    try {
        var clearFrame = decodePresetHeader(blob8.subarray(0, Util.presetHeaderLength));
        preset['clearFrame'] = clearFrame;
        var components = convertComponents(blob8.subarray(Util.presetHeaderLength));
        preset['components'] = components;
    } catch (e) {
        // TODO
        // if (verbosity < 0) console.error(`Error in '${file}'`);
        if (verbosity >= 1) console.error(e.stack);else console.error(e);
        // if(e instanceof Util.ConvertException) {
        //     console.error('Error: '+e.message);
        //     return null;
        // } else {
        //     throw e;
        // }
    }
    return preset;
};
exports.convertPreset = convertPreset;
var convertComponents = function convertComponents(blob) {
    var fp = 0;
    var components = [];
    var res;
    // read file as long as there are components left.
    // a component takes at least two int32s of space, if there are less bytes than that left,
    // ignore them. usually fp < blob.length should suffice but some rare presets have trailing
    // bytes. found in one preset's trailing colormap so far.
    while (fp <= blob.length - sizeInt * 2) {
        var code = Util.getUInt32(blob, fp);
        var i = getComponentIndex(code, blob, fp);
        var isDll = code !== 0xfffffffe && code >= Util.builtinMax ? 1 : 0;
        var size = getComponentSize(blob, fp + sizeInt + isDll * 32);
        // console.log("component size", size, "blob size", blob.length);
        if (i < 0) {
            res = { 'type': 'Unknown: (' + -i + ')' };
        } else {
            var offset = fp + sizeInt * 2 + isDll * 32;
            res = eval('decode_' + componentTable[i].func)(blob, offset, componentTable[i].fields, componentTable[i].name, componentTable[i].group, offset + size);
        }
        if (!res || (typeof res === "undefined" ? "undefined" : _typeof(res)) !== 'object') {
            throw new Util.ConvertException('Unknown convert error');
        }
        components.push(res);
        fp += size + sizeInt * 2 + isDll * 32;
    }
    return components;
};
exports.convertComponents = convertComponents;
var getComponentIndex = function getComponentIndex(code, blob, offset) {
    if (code < Util.builtinMax || code === 0xfffffffe) {
        for (var i = 0; i < componentTable.length; i++) {
            if (code === componentTable[i].code) {
                if (verbosity >= 1) console.log("Found component: " + componentTable[i].name + " (" + code + ")");
                return i;
            }
        }
    } else {
        for (var i = Components.builtin.length; i < componentTable.length; i++) {
            if (componentTable[i].code instanceof Array && Util.cmpBytes(blob, offset + sizeInt, componentTable[i].code)) {
                if (verbosity >= 1) console.log("Found component: " + componentTable[i].name);
                return i;
            }
        }
    }
    if (verbosity >= 1) console.log("Found unknown component (code: " + code + ")");
    return -code;
};
var getComponentSize = function getComponentSize(blob, offset) {
    return Util.getUInt32(blob, offset);
};
var decodePresetHeader = function decodePresetHeader(blob) {
    var presetHeader0_1 = [0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74, 0x20, 0x41, 0x56, 0x53, 0x20, 0x50, 0x72, 0x65, 0x73, 0x65, 0x74, 0x20, 0x30, 0x2E, 0x31, 0x1A];
    var presetHeader0_2 = [0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74, 0x20, 0x41, 0x56, 0x53, 0x20, 0x50, 0x72, 0x65, 0x73, 0x65, 0x74, 0x20, 0x30, 0x2E, 0x32, 0x1A];
    if (!Util.cmpBytes(blob, /*offset*/0, presetHeader0_2) && !Util.cmpBytes(blob, /*offset*/0, presetHeader0_1)) {
        throw new Util.ConvertException('Invalid preset header.\n' + '  This does not seem to be an AVS preset file.\n' + '  If it does load with Winamp\'s AVS please send the file in so we can look at it.');
    }
    return blob[Util.presetHeaderLength - 1] === 1; // 'Clear Every Frame'
};
//// component decode functions,
var decode_effectList = function decode_effectList(blob, offset, _, name) {
    var size = Util.getUInt32(blob, offset - sizeInt);
    var comp = {
        'type': name,
        'enabled': Util.getBit(blob, offset, 1)[0] !== 1,
        'clearFrame': Util.getBit(blob, offset, 0)[0] === 1,
        'input': Table['blendmodeIn'][blob[offset + 2]],
        'output': Table['blendmodeOut'][blob[offset + 3]]
    };
    var modebit = Util.getBit(blob, offset, 7)[0] === 1; // is true in all presets I know, probably only for truly ancient versions
    if (!modebit) {
        console.error('EL modebit is off!! If you\'re seeing this, send this .avs file in please!');
    }
    var configSize = (modebit ? blob[offset + 4] : blob[offset]) + 1;
    if (configSize > 1) {
        comp['inAdjustBlend'] = Util.getUInt32(blob, offset + 5);
        comp['outAdjustBlend'] = Util.getUInt32(blob, offset + 9);
        comp['inBuffer'] = Util.getUInt32(blob, offset + 13);
        comp['outBuffer'] = Util.getUInt32(blob, offset + 17);
        comp['inBufferInvert'] = Util.getUInt32(blob, offset + 21) === 1;
        comp['outBufferInvert'] = Util.getUInt32(blob, offset + 25) === 1;
        comp['enableOnBeat'] = Util.getUInt32(blob, offset + 29) === 1;
        comp['onBeatFrames'] = Util.getUInt32(blob, offset + 33);
    }
    var effectList28plusHeader = [0x00, 0x40, 0x00, 0x00, 0x41, 0x56, 0x53, 0x20, 0x32, 0x2E, 0x38, 0x2B, 0x20, 0x45, 0x66, 0x66, 0x65, 0x63, 0x74, 0x20, 0x4C, 0x69, 0x73, 0x74, 0x20, 0x43, 0x6F, 0x6E, 0x66, 0x69, 0x67, 0x00, 0x00, 0x00, 0x00, 0x00];
    var contentOffset = offset + configSize;
    if (Util.cmpBytes(blob, contentOffset, effectList28plusHeader)) {
        var codeOffset = offset + configSize + effectList28plusHeader.length;
        var codeSize = Util.getUInt32(blob, codeOffset);
        comp['code'] = Util.getCodeEIF(blob, codeOffset + sizeInt)[0];
        contentOffset = codeOffset + sizeInt + codeSize;
    }
    var content = convertComponents(blob.subarray(contentOffset, offset + size));
    comp['components'] = content;
    return comp;
};
// generic field decoding function that most components use.
var decode_generic = function decode_generic(blob, offset, fields, name, group, end) {
    var comp = {
        'type': Util.removeSpaces(name),
        'group': group
    };
    var keys = Object.keys(fields);
    var lastWasABitField = false;
    for (var i = 0; i < keys.length; i++) {
        if (offset >= end) {
            break;
        }
        var k = keys[i];
        var f = fields[k];
        // console.log(`key: ${k}, field: ${f}`);
        if (k.match(/^null[_0-9]*$/)) {
            offset += f;
            // 'null_: 0' resets bitfield continuity to allow several consecutive bitfields
            lastWasABitField = false;
            continue;
        }
        var size = 0;
        var value = void 0;
        var result = void 0;
        var num = typeof f === 'number';
        var other = typeof f === 'string';
        var array = f instanceof Array;
        if (num) {
            size = f;
            try {
                value = Util.getUInt(blob, offset, size);
            } catch (e) {
                throw new Util.ConvertException('Invalid field size: ' + f + '.');
            }
            lastWasABitField = false;
        } else if (other) {
            var func = 'get' + f;
            // console.log(`get: ${f}`);
            result = Util.callFunction(f, blob, offset);
            value = result[0];
            size = result[1];
            lastWasABitField = false;
        } else if (array && f.length >= 2) {
            if (f[0] === 'Bit') {
                if (lastWasABitField) {
                    offset -= 1; // compensate to stay in same bitfield
                }
                lastWasABitField = true;
            } else {
                lastWasABitField = false;
            }
            // console.log(`get: ${f[0]} ${f[1]} ${typeof f[1]}`);
            var tableName = Util.lowerInitial(f[0]);
            if (tableName in Table) {
                var tableKey = Util.getUInt(blob, offset, f[1]);
                value = Table[tableName][tableKey];
                size = f[1];
            } else {
                result = Util.callFunction(f[0], blob, offset, f[1]);
                size = result[1];
                value = result[0];
            }
            if (f[2]) {
                // console.log('get' + f[2]);
                tableName = Util.lowerInitial(f[2]);
                if (tableName in Table) {
                    value = Table[tableName][value];
                } else {
                    value = Util.callFunction(f[2], value);
                }
            }
        }
        // save value or function result of value in field
        if (k !== 'new_version') {
            comp[k] = value;
            if (verbosity >= 2) {
                console.log('- key: ' + k + '\n- val: ' + value);
                if (k === 'code') Util.printTable('- code', value);
                if (verbosity >= 3) console.log('- offset: ' + offset + '\n- size: ' + size);
                console.log();
            }
        }
        offset += size;
    }
    return comp;
};
var decode_versioned_generic = function decode_versioned_generic(blob, offset, fields, name, group, end) {
    var version = blob[offset];
    if (version === 1) {
        return decode_generic(blob, offset, fields, name, group, end);
    } else {
        var oldFields = {};
        for (var key in fields) {
            if (key === 'new_version') continue;
            if (key === 'code') oldFields[key] = fields['code'].replace(/Code([IFBP]+)/, '256Code$1');else oldFields[key] = fields[key];
        }
        if (verbosity >= 3) console.log('oldFields, code changed to:', oldFields['code']);
        return decode_generic(blob, offset, oldFields, name, group, end);
    }
};
var decode_movement = function decode_movement(blob, offset, _, name, group, end) {
    var comp = {
        'type': name,
        'group': group
    };
    // the special value 0 is because 'old versions of AVS barf' if the id is > 15, so
    // AVS writes out 0 in that case, and sets the actual id at the end of the save block.
    var effectIdOld = Util.getUInt32(blob, offset);
    var effect = [];
    var code;
    var hidden;
    if (effectIdOld !== 0) {
        if (effectIdOld === 0x7fff) {
            var strAndSize = ['', 0];
            if (blob[offset + sizeInt] === 1) {
                strAndSize = Util.getSizeString(blob, offset + sizeInt + 1);
            } else {
                strAndSize = Util.getSizeString(blob, offset + sizeInt, 256);
            }
            offset += strAndSize[1];
            code = strAndSize[0];
            if (strAndSize.length > 2) {
                hidden = strAndSize[2];
            }
        } else {
            if (effectIdOld > 15) {
                if (verbosity >= 0) {
                    console.error("Movement: Unknown effect id " + effectIdOld + ". This is a known bug.");
                    console.log('If you know an AVS version that will display this Movement as anything else but "None", then please send it in!');
                }
                effect = Table.movementEffect[0];
            } else {
                effect = Table.movementEffect[effectIdOld];
            }
        }
    } else {
        var effectIdNew = 0;
        if (offset + sizeInt * 6 < end) {
            effectIdNew = Util.getUInt32(blob, offset + sizeInt * 6); // 1*sizeInt, because of oldId=0, and 5*sizeint because of the other settings.
        }
        effect = Table.movementEffect[effectIdNew];
    }
    if (effect && effect.length > 0) {
        comp['builtinEffect'] = effect[0];
    }
    comp['output'] = Util.getUInt32(blob, offset + sizeInt) ? '50/50' : 'Replace';
    comp['sourceMapped'] = Util.getBool(blob, offset + sizeInt * 2, sizeInt)[0];
    comp['coordinates'] = Table.coordinates[Util.getUInt32(blob, offset + sizeInt * 3)];
    comp['bilinear'] = Util.getBool(blob, offset + sizeInt * 4, sizeInt)[0];
    comp['wrap'] = Util.getBool(blob, offset + sizeInt * 5, sizeInt)[0];
    if (effect && effect.length && effectIdOld !== 1 && effectIdOld !== 7) {
        code = effect[1];
        comp['coordinates'] = effect[2]; // overwrite
    }
    comp['code'] = code;
    if (hidden) comp['_hidden'] = hidden;
    return comp;
};
var decode_avi = function decode_avi(blob, offset) {
    var comp = {
        'type': 'AVI',
        'group': 'Render',
        'enabled': Util.getBool(blob, offset, sizeInt)[0]
    };
    var strAndSize = Util.getNtString(blob, offset + sizeInt * 3);
    comp['file'] = strAndSize[0];
    comp['speed'] = Util.getUInt32(blob, offset + sizeInt * 5 + strAndSize[1]); // 0: fastest, 1000: slowest
    var beatAdd = Util.getUInt32(blob, offset + sizeInt * 3 + strAndSize[1]);
    if (beatAdd) {
        comp['output'] = '50/50';
    } else {
        comp['output'] = Util.getMap8(blob, offset + sizeInt, { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' });
    }
    comp['onBeatAdd'] = beatAdd;
    comp['persist'] = Util.getUInt32(blob, offset + sizeInt * 4 + strAndSize[1]); // 0-32
    return comp;
};
var decode_simple = function decode_simple(blob, offset) {
    var comp = {
        'type': 'Simple',
        'group': 'Render'
    };
    var effect = Util.getUInt32(blob, offset);
    if (effect & 1 << 6) {
        comp['audioSource'] = effect & 2 ? 'Waveform' : 'Spectrum';
        comp['renderType'] = 'Dots';
    } else {
        switch (effect & 3) {
            case 0:
                // solid analyzer
                comp['audioSource'] = 'Spectrum';
                comp['renderType'] = 'Solid';
                break;
            case 1:
                // line analyzer
                comp['audioSource'] = 'Spectrum';
                comp['renderType'] = 'Lines';
                break;
            case 2:
                // line scope
                comp['audioSource'] = 'Waveform';
                comp['renderType'] = 'Lines';
                break;
            case 3:
                // solid scope
                comp['audioSource'] = 'Waveform';
                comp['renderType'] = 'Solid';
                break;
        }
    }
    comp['audioChannel'] = Table.audioChannel[effect >> 2 & 3];
    comp['positionY'] = Table.positionY[effect >> 4 & 3];
    comp['colors'] = Util.getColorList(blob, offset + sizeInt)[0];
    return comp;
};
//# sourceMappingURL=convert.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
// Constants
var sizeInt = 4;
var builtin = [{
    'name': 'Effect List',
    'code': 0xfffffffe,
    'group': '',
    'func': 'effectList'
}, {
    'name': 'Simple',
    'code': 0x00,
    'group': 'Render',
    'func': 'simple'
}, {
    'name': 'Dot Plane',
    'code': 0x01,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'rotationSpeed': 'Int32',
        'colorTop': 'Color',
        'colorHigh': 'Color',
        'colorMid': 'Color',
        'colorLow': 'Color',
        'colorBottom': 'Color',
        'angle': 'Int32',
        null0: sizeInt
    }
}, {
    'name': 'Oscilliscope Star',
    'code': 0x02,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'audioChannel': ['Bit', [2, 3], 'AudioChannel'],
        'positionX': ['Bit', [4, 5], 'PositionX'],
        null0: sizeInt - 1,
        'colors': 'ColorList',
        'size': sizeInt,
        'rotation': sizeInt
    }
}, {
    'name': 'FadeOut',
    'code': 0x03,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'speed': sizeInt,
        'color': 'Color'
    }
}, {
    'name': 'Blitter Feedback',
    'code': 0x04,
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'zoom': sizeInt,
        'onBeatZoom': sizeInt,
        'output': ['Map4', { 0: 'Replace', 1: '50/50' }],
        'onBeat': ['Bool', sizeInt],
        'bilinear': ['Bool', sizeInt]
    }
}, {
    'name': 'OnBeat Clear',
    'code': 0x05,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'color': 'Color',
        'output': ['Map4', { 0: 'Replace', 1: '50/50' }],
        'clearBeats': sizeInt
    }
}, {
    'name': 'Blur',
    'code': 0x06,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'blur': ['Map4', { 0: 'None', 1: 'Medium', 2: 'Light', 3: 'Heavy' }],
        'round': ['Map4', { 0: 'Down', 1: 'Up' }]
    }
}, {
    'name': 'Bass Spin',
    'code': 0x07,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabledLeft': ['Bit', 0, 'Boolified'],
        'enabledRight': ['Bit', 1, 'Boolified'],
        null0: sizeInt - 1,
        'colorLeft': 'Color',
        'colorRight': 'Color',
        'mode': ['Map4', { 0: 'Lines', 1: 'Triangles' }]
    }
}, {
    'name': 'Moving Particle',
    'code': 0x08,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'enabled': ['Bit', 0, 'Boolified'],
        'onBeatSizeChange': ['Bit', 1, 'Boolified'],
        null0: sizeInt - 1,
        'color': 'Color',
        'range': sizeInt,
        'size': sizeInt,
        'onBeatSize': sizeInt,
        'output': ['Map4', { 0: 'Replace', 1: 'Additive', 2: '50/50', 3: 'Default' }]
    }
}, {
    'name': 'Roto Blitter',
    'code': 0x09,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'zoom': sizeInt,
        'rotate': sizeInt,
        'output': ['Map4', { '0': 'Replace', '1': '50/50' }],
        'onBeatReverse': ['Bool', sizeInt],
        'reversalSpeed': sizeInt,
        'onBeatZoom': sizeInt,
        'onBeat': ['Bool', sizeInt],
        'bilinear': ['Bool', sizeInt]
    }
}, {
    'name': 'SVP',
    'code': 0x0A,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'library': ['SizeString', 260]
    }
}, {
    'name': 'Colorfade',
    'code': 0x0B,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bit', 0, 'Boolified'],
        'onBeat': ['Bit', 2, 'Boolified'],
        'onBeatRandom': ['Bit', 1, 'Boolified'],
        null0: sizeInt - 1,
        'fader1': 'Int32',
        'fader2': 'Int32',
        'fader3': 'Int32',
        'beatFader1': 'Int32',
        'beatFader2': 'Int32',
        'beatFader3': 'Int32'
    }
}, {
    'name': 'Color Clip',
    'code': 0x0C,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'mode': ['Map4', { 0: 'Off', 1: 'Below', 2: 'Above', 3: 'Near' }],
        'colorFrom': 'Color',
        'colorTo': 'Color',
        'colorDistance': sizeInt
    }
}, {
    'name': 'Rotating Stars',
    'code': 0x0D,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'colors': 'ColorList'
    }
}, {
    'name': 'Ring',
    'code': 0x0E,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'audioChannel': ['Bit', [2, 3], 'AudioChannel'],
        'positionX': ['Bit', [4, 5], 'PositionX'],
        null0: sizeInt - 1,
        'colors': 'ColorList',
        'size': sizeInt,
        'audioSource': ['UInt32', sizeInt, 'AudioSource']
    }
}, {
    'name': 'Movement',
    'code': 0x0F,
    'group': 'Trans',
    'func': 'movement'
}, {
    'name': 'Scatter',
    'code': 0x10,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt]
    }
}, {
    'name': 'Dot Grid',
    'code': 0x11,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'colors': 'ColorList',
        'spacing': sizeInt,
        'speedX': 'Int32',
        'speedY': 'Int32',
        'output': ['Map4', { 0: 'Replace', 1: 'Additive', 2: '50/50', 3: 'Default' }]
    }
}, {
    'name': 'Buffer Save',
    'code': 0x12,
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'mode': ['BufferMode', sizeInt],
        'buffer': ['BufferNum', sizeInt],
        'blend': ['BlendmodeBuffer', sizeInt],
        'adjustBlend': sizeInt
    }
}, {
    'name': 'Dot Fountain',
    'code': 0x13,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'rotationSpeed': 'Int32',
        'colorTop': 'Color',
        'colorHigh': 'Color',
        'colorMid': 'Color',
        'colorLow': 'Color',
        'colorBottom': 'Color',
        'angle': 'Int32',
        null0: sizeInt
    }
}, {
    'name': 'Water',
    'code': 0x14,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt]
    }
}, {
    'name': 'Comment',
    'code': 0x15,
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'text': 'SizeString'
    }
}, {
    'name': 'Brightness',
    'code': 0x16,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'output': ['Map8', { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' }],
        'red': 'Int32',
        'green': 'Int32',
        'blue': 'Int32',
        'separate': ['Bool', sizeInt],
        'excludeColor': 'Color',
        'exclude': ['Bool', sizeInt],
        'distance': sizeInt
    }
}, {
    'name': 'Interleave',
    'code': 0x17,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'x': sizeInt,
        'y': sizeInt,
        'color': 'Color',
        'output': ['Map8', { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' }],
        'onbeat': ['Bool', sizeInt],
        'x2': sizeInt,
        'y2': sizeInt,
        'beatDuration': sizeInt
    }
}, {
    'name': 'Grain',
    'code': 0x18,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'output': ['Map8', { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' }],
        'amount': sizeInt,
        'static': ['Bool', sizeInt]
    }
}, {
    'name': 'Clear Screen',
    'code': 0x19,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'color': 'Color',
        'output': ['Map8', { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50', 2: 'Default' }],
        'onlyFirst': ['Bool', sizeInt]
    }
}, {
    'name': 'Mirror',
    'code': 0x1A,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'topToBottom': ['Bit', 0, 'Boolified'],
        'bottomToTop': ['Bit', 1, 'Boolified'],
        'leftToRight': ['Bit', 2, 'Boolified'],
        'rightToLeft': ['Bit', 3, 'Boolified'],
        null0: sizeInt - 1,
        'onBeat': ['Bool', sizeInt],
        'smooth': ['Bool', sizeInt],
        'speed': sizeInt
    }
}, {
    'name': 'Starfield',
    'code': 0x1B,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'enabled': sizeInt,
        'color': 'Color',
        'output': ['Map8', { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' }],
        'WarpSpeed': 'Float',
        'MaxStars_set': sizeInt,
        'onbeat': sizeInt,
        'spdBeat': 'Float',
        'durFrames': sizeInt
    }
}, {
    'name': 'Text',
    'code': 0x1C,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'color': 'Color',
        'output': ['Map8', { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' }],
        'onBeat': ['Bool', sizeInt],
        'insertBlanks': ['Bool', sizeInt],
        'randomPosition': ['Bool', sizeInt],
        'verticalAlign': ['Map4', { '0': 'Top', '4': 'Center', '8': 'Bottom' }],
        'horizontalAlign': ['Map4', { '0': 'Left', '1': 'Center', '2': 'Right' }],
        'onBeatSpeed': sizeInt,
        'normSpeed': sizeInt,
        null0: 60,
        // Win LOGFONT structure, 60bytes, this is more interesting:
        null1: sizeInt * 4,
        // LONG  lfWidth;
        // LONG  lfEscapement;
        // LONG  lfOrientation;
        // LONG  lfWeight;
        'weight': ['Map4', { '0': 'Dontcare', '100': 'Thin', '200': 'Extralight', '300': 'Light', '400': 'Regular', '500': 'Medium', '600': 'Semibold', '700': 'Bold', '800': 'Extrabold', '900': 'Black' }],
        'italic': ['Bool', 1],
        'underline': ['Bool', 1],
        'strikeOut': ['Bool', 1],
        'charSet': 1,
        null2: 4,
        // BYTE  lfClipPrecision;
        // BYTE  lfQuality;
        // BYTE  lfPitchAndFamily;
        'fontName': ['SizeString', 32],
        'text': ['SizeString', 0 /*==var length*/, 'SemiColSplit'],
        'outline': ['Bool', sizeInt],
        'outlineColor': 'Color',
        'shiftX': sizeInt,
        'shiftY': sizeInt,
        'outlineShadowSize': sizeInt,
        'randomWord': ['Bool', sizeInt],
        'shadow': ['Bool', sizeInt]
    }
}, {
    'name': 'Bump',
    'code': 0x1D,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'onBeat': ['Bool', sizeInt],
        'duration': sizeInt,
        'depth': sizeInt,
        'onBeatDepth': sizeInt,
        'output': ['Map8', { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' }],
        'code': 'CodeFBI',
        'showDot': ['Bool', sizeInt],
        'invertDepth': ['Bool', sizeInt],
        null0: sizeInt,
        'depthBuffer': ['BufferNum', sizeInt]
    }
}, {
    'name': 'Mosaic',
    'code': 0x1E,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'size': sizeInt,
        'onBeatSize': sizeInt,
        'output': ['Map8', { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' }],
        'onbeat': ['Bool', sizeInt],
        'durFrames': sizeInt
    }
}, {
    'name': 'Water Bump',
    'code': 0x1F,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'density': sizeInt,
        'depth': sizeInt,
        'random': ['Bool', sizeInt],
        'dropPositionX': sizeInt,
        'dropPositionY': sizeInt,
        'dropRadius': sizeInt,
        'method': sizeInt
    }
}, {
    'name': 'AVI',
    'code': 0x20,
    'group': 'Trans',
    'func': 'avi'
}, {
    'name': 'Custom BPM',
    'code': 0x21,
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'mode': ['RadioButton', { 0: 'Arbitrary', 1: 'Skip', 2: 'Reverse' }],
        'arbitraryValue': sizeInt,
        'skipValue': sizeInt,
        'skipFirstBeats': sizeInt
    }
}, {
    'name': 'Picture',
    'code': 0x22,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'output': ['Map8', { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' }],
        'adapt': sizeInt,
        'onBeatPersist': sizeInt,
        'file': 'NtString',
        'ratio': sizeInt,
        'aspectRatioAxis': ['Map4', { 0: 'X', 1: 'Y' }]
    }
}, {
    'name': 'Dynamic Distance Modifier',
    'code': 0x23,
    'group': 'Trans',
    'func': 'versioned_generic',
    'fields': {
        'new_version': ['Bool', 1],
        'code': 'CodePFBI',
        'output': ['Map4', { 0: 'Replace', 1: '50/50' }],
        'bilinear': ['Bool', sizeInt]
    }
}, {
    'name': 'Super Scope',
    'code': 0x24,
    'group': 'Render',
    'func': 'versioned_generic',
    'fields': {
        'new_version': ['Bool', 1],
        'code': 'CodePFBI',
        'audioChannel': ['Bit', [0, 1], 'AudioChannel'],
        'audioSource': ['Bit', 2, 'AudioSource'],
        null0: 3,
        'colors': 'ColorList',
        'lineType': ['DrawMode', sizeInt]
    }
}, {
    'name': 'Invert',
    'code': 0x25,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt]
    }
}, {
    'name': 'Unique Tone',
    'code': 0x26,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'color': 'Color',
        'output': ['Map8', { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' }],
        'invert': ['Bool', sizeInt]
    }
}, {
    'name': 'Timescope',
    'code': 0x27,
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'color': 'Color',
        'output': ['Map8', { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50', 2: 'Default' }],
        'audioChannel': ['UInt32', sizeInt, 'AudioChannel'],
        'bands': sizeInt
    }
}, {
    'name': 'Set Render Mode',
    'code': 0x28,
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'blend': ['BlendmodeRender', 1],
        'adjustBlend': 1,
        'lineSize': 1,
        'enabled': ['Bit', 7, 'Boolified']
    }
}, {
    'name': 'Interferences',
    'code': 0x29,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'numberOfLayers': sizeInt,
        null0: sizeInt,
        'distance': sizeInt,
        'alpha': sizeInt,
        'rotation': 'Int32',
        'output': ['Map8', { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' }],
        'onBeatDistance': sizeInt,
        'onBeatAlpha': sizeInt,
        'onBeatRotation': sizeInt,
        'separateRGB': ['Bool', sizeInt],
        'onBeat': ['Bool', sizeInt],
        'speed': 'Float'
    }
}, {
    'name': 'Dynamic Shift',
    'code': 0x2A,
    'group': 'Trans',
    'func': 'versioned_generic',
    'fields': {
        'new_version': ['Bool', 1],
        'code': 'CodeIFB',
        'output': ['Map4', { 0: 'Replace', 1: '50/50' }],
        'bilinear': ['Bool', sizeInt]
    }
}, {
    'name': 'Dynamic Movement',
    'code': 0x2B,
    'group': 'Trans',
    'func': 'versioned_generic',
    'fields': {
        'new_version': ['Bool', 1],
        'code': 'CodePFBI',
        'bilinear': ['Bool', sizeInt],
        'coordinates': ['Coordinates', sizeInt],
        'gridW': sizeInt,
        'gridH': sizeInt,
        'alpha': ['Bool', sizeInt],
        'wrap': ['Bool', sizeInt],
        'buffer': ['BufferNum', sizeInt],
        'alphaOnly': ['Bool', sizeInt]
    }
}, {
    'name': 'Fast Brightness',
    'code': 0x2C,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'factor': ['Map4', { 0: 2, 1: 0.5, 2: 1 }]
    }
}, {
    'name': 'Color Modifier',
    'code': 0x2D,
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'recomputeEveryFrame': ['Bool', 1],
        'code': 'CodePFBI'
    }
}];
exports.builtin = builtin;
//// APEs
var dll = [{
    'name': 'AVS Trans Automation',
    'code': // Misc: AVSTrans Automation.......
    [0x4D, 0x69, 0x73, 0x63, 0x3A, 0x20, 0x41, 0x56, 0x53, 0x54, 0x72, 0x61, 0x6E, 0x73, 0x20, 0x41, 0x75, 0x74, 0x6F, 0x6D, 0x61, 0x74, 0x69, 0x6F, 0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'logging': ['Bool', sizeInt],
        'translateFirstLevel': ['Bool', sizeInt],
        'readCommentCodes': ['Bool', sizeInt],
        'code': 'NtString'
    }
}, {
    'name': 'Texer',
    'code': // Texer...........................
    [0x54, 0x65, 0x78, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        null0: sizeInt * 4,
        'image': ['SizeString', 260],
        'input': ['Bit', 0, 'BlendmodeIn'],
        'output': ['Bit', 2, 'BlendmodeTexer'],
        null1: 3,
        'particles': sizeInt,
        null2: 4
    }
}, {
    'name': 'Texer II',
    'code': // Acko.net: Texer II..............
    [0x41, 0x63, 0x6B, 0x6F, 0x2E, 0x6E, 0x65, 0x74, 0x3A, 0x20, 0x54, 0x65, 0x78, 0x65, 0x72, 0x20, 0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Render',
    'func': 'generic',
    'fields': {
        null0: sizeInt,
        'image': ['SizeString', 260],
        'resizing': ['Bool', sizeInt],
        'wrap': ['Bool', sizeInt],
        'coloring': ['Bool', sizeInt],
        null1: sizeInt,
        'code': 'CodeIFBP'
    }
}, {
    'name': 'Color Map',
    'code': // Color Map.......................
    [0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x4D, 0x61, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'key': ['ColorMapKey', sizeInt],
        'output': ['BlendmodeColorMap', sizeInt],
        'mapCycling': ['ColorMapCycleMode', sizeInt],
        'adjustBlend': 1,
        null0: 1,
        'dontSkipFastBeats': ['Bool', 1],
        'cycleSpeed': 1,
        'maps': 'ColorMaps'
    }
}, {
    'name': 'Framerate Limiter',
    'code': // VFX FRAMERATE LIMITER...........
    [0x56, 0x46, 0x58, 0x20, 0x46, 0x52, 0x41, 0x4D, 0x45, 0x52, 0x41, 0x54, 0x45, 0x20, 0x4C, 0x49, 0x4D, 0x49, 0x54, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'limit': sizeInt
    }
}, {
    'name': 'Convolution Filter',
    'code': // Holden03: Convolution Filter....
    [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x33, 0x3A, 0x20, 0x43, 0x6F, 0x6E, 0x76, 0x6F, 0x6C, 0x75, 0x74, 0x69, 0x6F, 0x6E, 0x20, 0x46, 0x69, 0x6C, 0x74, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00],
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'wrap': ['Bool', sizeInt],
        'absolute': ['Bool', sizeInt],
        '2-pass': ['Bool', sizeInt],
        'kernel': ['ConvoFilter', [7, 7]],
        'bias': 'Int32',
        'scaling': 'Int32'
    }
}, {
    'name': 'Triangle',
    'code': // Render: Triangle................
    [0x52, 0x65, 0x6E, 0x64, 0x65, 0x72, 0x3A, 0x20, 0x54, 0x72, 0x69, 0x61, 0x6E, 0x67, 0x6C, 0x65, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'code': 'NtCodeIFBP'
    }
}, {
    'name': 'Channel Shift',
    'code': // Channel Shift...................
    [0x43, 0x68, 0x61, 0x6E, 0x6E, 0x65, 0x6C, 0x20, 0x53, 0x68, 0x69, 0x66, 0x74, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        // some keys seeem to have changed between versions.
        'mode': ['Map4', { 0: 'RGB', 1023: 'RGB', 1144: 'RGB', 1020: 'RBG', 1019: 'BRG', 1021: 'BGR', 1018: 'GBR', 1022: 'GRB', 1183: 'RGB' /*1183 (probably from an old APE version?) presents as if nothing is selected, so set to RGB*/ }],
        'onBeatRandom': ['Bool', sizeInt]
    }
}, {
    'name': 'Normalize',
    'code': // Trans: Normalise................
    [0x54, 0x72, 0x61, 0x6E, 0x73, 0x3A, 0x20, 0x4E, 0x6F, 0x72, 0x6D, 0x61, 0x6C, 0x69, 0x73, 0x65, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt]
    }
}, {
    'name': 'Video Delay',
    'code': // Holden04: Video Delay...........
    [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x34, 0x3A, 0x20, 0x56, 0x69, 0x64, 0x65, 0x6F, 0x20, 0x44, 0x65, 0x6C, 0x61, 0x79, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'useBeats': ['Bool', sizeInt],
        'delay': sizeInt
    }
}, {
    'name': 'Multiplier',
    'code': // Multiplier......................
    [0x4D, 0x75, 0x6C, 0x74, 0x69, 0x70, 0x6C, 0x69, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'multiply': ['Map4', { 0: 'Infinite Root', 1: 8, 2: 4, 3: 2, 4: 0.5, 5: 0.25, 6: 0.125, 7: 'Infinite Square' }]
    }
}, {
    'name': 'Color Reduction',
    'code': // Color Reduction.................
    [0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x52, 0x65, 0x64, 0x75, 0x63, 0x74, 0x69, 0x6F, 0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        null0: 260,
        'colors': ['Map4', { 1: 2, 2: 4, 3: 8, 4: 16, 5: 32, 6: 64, 7: 128, 8: 256 }]
    }
}, {
    'name': 'Multi Delay',
    'code': // Holden05: Multi Delay...........
    [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x35, 0x3A, 0x20, 0x4D, 0x75, 0x6C, 0x74, 0x69, 0x20, 0x44, 0x65, 0x6C, 0x61, 0x79, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Trans',
    'func': 'generic',
    'fields': {
        'mode': ['Map4', { 0: 'Disabled', 1: 'Input', 2: 'Output' }],
        'activeBuffer': sizeInt,
        'useBeats0': ['Bool', sizeInt],
        'delay0': sizeInt,
        'useBeats1': ['Bool', sizeInt],
        'delay1': sizeInt,
        'useBeats2': ['Bool', sizeInt],
        'delay2': sizeInt,
        'useBeats3': ['Bool', sizeInt],
        'delay3': sizeInt,
        'useBeats4': ['Bool', sizeInt],
        'delay4': sizeInt,
        'useBeats5': ['Bool', sizeInt],
        'delay5': sizeInt
    }
}, {
    'name': 'Buffer Blend',
    'code': // Misc: Buffer blend..............
    [0x4D, 0x69, 0x73, 0x63, 0x3A, 0x20, 0x42, 0x75, 0x66, 0x66, 0x65, 0x72, 0x20, 0x62, 0x6C, 0x65, 0x6E, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'bufferB': ['BufferBlendBuffer', sizeInt],
        'bufferA': ['BufferBlendBuffer', sizeInt],
        'mode': ['BufferBlendMode', sizeInt]
    }
}, {
    'name': 'MIDI Trace',
    'code': // Nullsoft Pixelcorps: MIDItrace .
    [0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74, 0x20, 0x50, 0x69, 0x78, 0x65, 0x6C, 0x63, 0x6F, 0x72, 0x70, 0x73, 0x3A, 0x20, 0x4D, 0x49, 0x44, 0x49, 0x74, 0x72, 0x61, 0x63, 0x65, 0x20, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'channel': sizeInt,
        'mode': ['Map4', { 1: 'Current', 2: 'Trigger' }],
        'allChannels': ['Bool', sizeInt],
        'printEvents': ['Bool', sizeInt]
    }
}, {
    'name': 'Add Borders',
    'code': // Virtual Effect: Addborders......
    [0x56, 0x69, 0x72, 0x74, 0x75, 0x61, 0x6C, 0x20, 0x45, 0x66, 0x66, 0x65, 0x63, 0x74, 0x3A, 0x20, 0x41, 0x64, 0x64, 0x62, 0x6F, 0x72, 0x64, 0x65, 0x72, 0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'color': 'Color',
        'size': sizeInt
    }
}, {
    'name': 'AVI Player',
    'code': // VFX AVI PLAYER..................
    [0x56, 0x46, 0x58, 0x20, 0x41, 0x56, 0x49, 0x20, 0x50, 0x4C, 0x41, 0x59, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'filePath': ['SizeString', 256],
        'enabled': ['Bool', sizeInt]
    }
}, {
    'name': 'FyrewurX',
    'code': // FunkyFX FyrewurX v1.............
    [0x46, 0x75, 0x6E, 0x6B, 0x79, 0x46, 0x58, 0x20, 0x46, 0x79, 0x72, 0x65, 0x77, 0x75, 0x72, 0x58, 0x20, 0x76, 0x31, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt]
    }
}, {
    'name': 'Global Variables',
    'code': // Jheriko: Global.................
    [0x4A, 0x68, 0x65, 0x72, 0x69, 0x6B, 0x6F, 0x3A, 0x20, 0x47, 0x6C, 0x6F, 0x62, 0x61, 0x6C, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'load': ['Map4', { 0: 'None', 1: 'Once', 2: 'CodeControl', 3: 'EveryFrame' }],
        null0: sizeInt * 6,
        'code': 'NtCodeIFB',
        'file': 'NtString',
        'saveRegRange': 'NtString',
        'saveBufRange': 'NtString'
    }
}, {
    'name': 'Fluid',
    'code': // GeissFluid......................
    [0x47, 0x65, 0x69, 0x73, 0x73, 0x46, 0x6C, 0x75, 0x69, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        null0: sizeInt
    }
}, {
    'name': 'Picture II',
    'code': // Picture II......................
    [0x50, 0x69, 0x63, 0x74, 0x75, 0x72, 0x65, 0x20, 0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'image': ['NtString', 260],
        'output': ['BlendmodePicture2', sizeInt],
        'onBeatOutput': ['BlendmodePicture2', sizeInt],
        'bilinear': ['Bool', sizeInt],
        'onBeatBilinear': ['Bool', sizeInt],
        'adjustBlend': sizeInt,
        'onBeatAdjustBlend': sizeInt
    }
}, {
    'name': 'MultiFilter',
    'code': // Jheriko : MULTIFILTER...........
    [0x4A, 0x68, 0x65, 0x72, 0x69, 0x6B, 0x6F, 0x20, 0x3A, 0x20, 0x4D, 0x55, 0x4C, 0x54, 0x49, 0x46, 0x49, 0x4C, 0x54, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Misc',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', sizeInt],
        'effect': ['MultiFilterEffect', sizeInt],
        'onBeat': ['Bool', sizeInt],
        null0: ['Bool', sizeInt]
    }
}, { 'name': 'Particle System',
    'code': // ParticleSystem..................
    [0x50, 0x61, 0x72, 0x74, 0x69, 0x63, 0x6C, 0x65, 0x53, 0x79, 0x73, 0x74, 0x65, 0x6D, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    'group': 'Render',
    'func': 'generic',
    'fields': {
        'enabled': ['Bool', 1],
        'bigParticles': ['Bool', 1],
        null0: 2,
        'particles': sizeInt,
        'particles+/-': sizeInt,
        'lifetime': sizeInt,
        'lifetime+/-': sizeInt,
        null1: 32,
        'spread': 'Float',
        'initialSpeed': 'Float',
        'initialSpeed+/-': 'Float',
        'acceleration': 'Float',
        'accelerationType': ['ParticleSystemAccelerationType', sizeInt],
        'color': 'Color',
        'color+/-': 'Color',
        'colorChange3': 1,
        'colorChange2': 1,
        'colorChange1': 1,
        null2: 1,
        'colorChange+/-3': 1,
        'colorChange+/-2': 1,
        'colorChange+/-1': 1,
        null3: 1,
        'colorBounce': ['ParticleSystemColorBounce', sizeInt]
    }
    /*
    {'name': '',
        'code':
            [],
        'group': '', 'func': 'generic', 'fields': {
         }},
    */
}];
exports.dll = dll;
//# sourceMappingURL=components.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _this = undefined;
Object.defineProperty(exports, "__esModule", { value: true });
// Constants
var sizeInt = 4;
var allFields = true;
var presetHeaderLength = 25;
exports.presetHeaderLength = presetHeaderLength;
var builtinMax = 16384;
exports.builtinMax = builtinMax;
var hiddenStrings = false;
var setHiddenStrings = function setHiddenStrings(value) {
    hiddenStrings = value;
};
exports.setHiddenStrings = setHiddenStrings;
var verbosity = 0;
var setVerbosity = function setVerbosity(value) {
    verbosity = value;
};
exports.setVerbosity = setVerbosity;
var ConvertException = /** @class */function () {
    function ConvertException(msg) {
        this.msg = msg;
        this.name = 'ConvertException';
        this.message = msg;
    }
    ConvertException.prototype.toString = function () {
        return this.name + " : " + this.message;
    };
    return ConvertException;
}();
exports.ConvertException = ConvertException;
var cmpBytes = function cmpBytes(arr, offset, test) {
    for (var i = 0; i < test.length; i++) {
        if (test[i] === null) {
            continue; // null means 'any value' - a letiable
        }
        if (arr[i + offset] !== test[i]) {
            return false;
        }
    }
    return true;
};
exports.cmpBytes = cmpBytes;
var printTable = function printTable(name, table) {
    console.log(name + ":");
    for (var key in table) {
        console.log("\t" + key + ": " + (table[key] ? ('' + table[key]).replace(/\n/g, '\n\t\t') : 'undefined'));
    }
};
exports.printTable = printTable;
function callFunction(funcName, blobOrValue, offset, extra) {
    try {
        if (blobOrValue instanceof Uint8Array) {
            return eval('get' + funcName)(blobOrValue, offset, extra);
        } else {
            return eval('get' + funcName)(blobOrValue);
        }
    } catch (e) {
        if (e.message.search(/not a function|has no method/) >= 0) {
            throw new ConvertException("Method or table '" + ('get' + funcName) + "' was not found. Correct capitalization?");
        } else {
            throw e;
        }
    }
}
exports.callFunction = callFunction;
var getBit = function getBit(blob, offset, pos) {
    if (pos.length) {
        if (pos.length !== 2) throw new _this.ConvertException("Invalid Bitfield range " + pos + ".");
        var mask = (2 << pos[1] - pos[0]) - 1;
        return [blob[offset] >> pos[0] & mask, 1];
    } else {
        return [blob[offset] >> pos & 1, 1];
    }
};
exports.getBit = getBit;
var getUInt = function getUInt(blob, offset, size) {
    if (offset > blob.length - size) {
        if (verbosity >= 1) console.log('WARNING: getUInt: offset overflow', offset, '>', blob.length - size);
        return 0;
    }
    switch (size) {
        case 1:
            return blob[offset];
        case sizeInt:
            return getUInt32(blob, offset);
        case sizeInt * 2:
            return getUInt64(blob, offset);
        default:
            throw new ConvertException("Invalid integer size '" + size + "', only 1, " + sizeInt + " and " + sizeInt * 2 + " allowed.");
    }
};
exports.getUInt = getUInt;
var getUInt32 = function getUInt32(blob, offset) {
    if (!offset) offset = 0;
    if (offset > blob.length - sizeInt) {
        if (verbosity >= 1) console.log('WARNING: getUInt32: offset overflow', offset, '>', blob.length - sizeInt);
        return 0;
    }
    var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
    try {
        return new Uint32Array(array, 0, 1)[0];
    } catch (e) {
        if (e instanceof RangeError) {
            console.error(e.stack);
            throw new ConvertException("Invalid offset " + offset + " to getUInt32.\nIs this preset very old? Send it in, so we can look at it!");
        } else {
            throw e;
        }
    }
};
exports.getUInt32 = getUInt32;
var getInt32 = function getInt32(blob, offset) {
    if (!offset) offset = 0;
    if (offset > blob.length - sizeInt) {
        if (verbosity >= 1) console.log('WARNING: getInt32: offset overflow', offset, '>', blob.length - sizeInt);
        return [0, sizeInt];
    }
    var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
    try {
        return [new Int32Array(array, 0, 1)[0], sizeInt];
    } catch (e) {
        if (e instanceof RangeError) {
            throw new ConvertException("Invalid offset " + offset + " to getInt32.\nIs this preset very old? Send it in, so we can look at it!");
        } else {
            throw e;
        }
    }
};
exports.getInt32 = getInt32;
var getUInt64 = function getUInt64(blob, offset) {
    if (!offset) offset = 0;
    if (offset > blob.length - sizeInt * 2) {
        if (verbosity >= 1) console.log('WARNING: getUInt64: offset overflow', offset, '>', blob.length - sizeInt * 2);
        return 0;
    }
    var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt * 2);
    try {
        var two32 = new Uint32Array(array, 0, 2);
        return two32[0] + two32[1] * 0x100000000;
    } catch (e) {
        if (e instanceof RangeError) {
            throw new ConvertException("Invalid offset " + offset + " to getUInt64.\nIs this preset very old? Send it in, so we can look at it!");
        } else {
            throw e;
        }
    }
};
exports.getUInt64 = getUInt64;
var getFloat = function getFloat(blob, offset) {
    if (!offset) offset = 0;
    var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
    try {
        return [new Float32Array(array, 0, 1)[0], 4];
    } catch (e) {
        if (e instanceof RangeError) {
            throw new ConvertException("Invalid offset " + offset + " to getFloat.\nIs this preset very old? Send it in, so we can look at it!");
        } else {
            throw e;
        }
    }
};
exports.getFloat = getFloat;
var getBool = function getBool(blob, offset, size) {
    var val = size === 1 ? blob[offset] : getUInt32(blob, offset);
    return [val !== 0, size];
};
exports.getBool = getBool;
var getBoolified = function getBoolified(num) {
    return num === 0 ? false : true;
};
exports.getBoolified = getBoolified;
var getSizeString = function getSizeString(blob, offset, size) {
    var add = 0;
    var result = '';
    var getHidden = false;
    if (!size) {
        size = getUInt32(blob, offset);
        add = sizeInt;
    } else {
        getHidden = hiddenStrings;
    }
    var end = offset + size + add;
    var i = offset + add;
    var c = blob[i];
    while (c > 0 && i < end) {
        result += String.fromCharCode(c);
        c = blob[++i];
    }
    var hidden = [];
    if (getHidden) {
        hidden = getHiddenStrings(blob, i, end);
    }
    if (hidden.length === 0) {
        return [result, size + add];
    } else {
        return [result, size + add, hidden];
    }
};
exports.getSizeString = getSizeString;
var getHiddenStrings = function getHiddenStrings(blob, i, end) {
    var nonPrintables = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 127, 129, 141, 143, 144, 157, 173];
    var hidden = [];
    while (i < end) {
        var c = blob[i];
        var s = '';
        while (nonPrintables.indexOf(c) < 0 && i < end) {
            s += String.fromCharCode(c);
            c = blob[++i];
        }
        i++;
        // mostly of interest might be (lost) code, and thus check for '=' to
        // weed out a lot of random uninteresting strings.
        // TODO: more sophisticated filter
        if (s.length > 4 && s.indexOf('=') >= 0) {
            hidden.push(s);
        }
    }
    return hidden;
};
var getNtString = function getNtString(blob, offset) {
    var result = '';
    var i = offset;
    var c = blob[i];
    while (c > 0) {
        result += String.fromCharCode(c);
        c = blob[++i];
    }
    return [result, i - offset + 1];
};
exports.getNtString = getNtString;
var removeSpaces = function removeSpaces(str) {
    return str.replace(/[ ]/g, '');
};
exports.removeSpaces = removeSpaces;
var lowerInitial = function lowerInitial(str) {
    return str[0].toLowerCase() + str.slice(1);
};
exports.lowerInitial = lowerInitial;
var getMap1 = function getMap1(blob, offset, map) {
    return [getMapping(map, blob[offset]), 1];
};
exports.getMap1 = getMap1;
var getMap4 = function getMap4(blob, offset, map) {
    return [getMapping(map, getUInt32(blob, offset)), sizeInt];
};
exports.getMap4 = getMap4;
var getMap8 = function getMap8(blob, offset, map) {
    return [getMapping(map, getUInt64(blob, offset)), sizeInt * 2];
};
exports.getMap8 = getMap8;
var getRadioButton = function getRadioButton(blob, offset, map) {
    var key = 0;
    for (var i = 0; i < map.length; i++) {
        var on = getUInt32(blob, offset + sizeInt * i) !== 0 ? 1 : 0;
        if (on) {
            key = on * (i + 1);
        }
    }
    return [getMapping(map, key), sizeInt * map.length];
};
exports.getRadioButton = getRadioButton;
var getMapping = function getMapping(map, key) {
    var value = map[key];
    if (value === undefined) {
        throw new ConvertException("Map: A value for key '" + key + "' does not exist.");
    } else {
        return value;
    }
};
exports.getMapping = getMapping;
// Point, Frame, Beat, Init code fields - reorder to I,F,B,P order.
var getCodePFBI = function getCodePFBI(blob, offset) {
    var map = [['init', 3], ['perFrame', 1], ['onBeat', 2], ['perPoint', 0]];
    return getCodeSection(blob, offset, map);
};
exports.getCodePFBI = getCodePFBI;
// Frame, Beat, Init code fields - reorder to I,F,B order.
var getCodeFBI = function getCodeFBI(blob, offset) {
    var map = [['init', 2], ['perFrame', 1], ['onBeat', 0]];
    return getCodeSection(blob, offset, map);
};
exports.getCodeFBI = getCodeFBI;
var getCodeIFBP = function getCodeIFBP(blob, offset) {
    var map = [['init', 0], ['perFrame', 1], ['onBeat', 2], ['perPoint', 3]];
    return getCodeSection(blob, offset, map);
};
exports.getCodeIFBP = getCodeIFBP;
var getCodeIFB = function getCodeIFB(blob, offset) {
    var map = [['init', 0], ['perFrame', 1], ['onBeat', 2]];
    return getCodeSection(blob, offset, map);
};
exports.getCodeIFB = getCodeIFB;
// used by 2.8+ 'Effect List'
var getCodeEIF = function getCodeEIF(blob, offset) {
    var map = [['init', 0], ['perFrame', 1]];
    var code = getCodeSection(blob, offset, map);
    return [{
        'enabled': getBool(blob, offset, sizeInt)[0],
        'init': code[0]['init'],
        'perFrame': code[0]['perFrame']
    }, code[1]];
};
exports.getCodeEIF = getCodeEIF;
// used only by 'Global Variables'
var getNtCodeIFB = function getNtCodeIFB(blob, offset) {
    var map = [['init', 0], ['perFrame', 1], ['onBeat', 2]];
    return getCodeSection(blob, offset, map, /*nullterminated*/true);
};
exports.getNtCodeIFB = getNtCodeIFB;
// used only by 'Triangle'
var getNtCodeIFBP = function getNtCodeIFBP(blob, offset) {
    var map = [['init', 0], ['perFrame', 1], ['onBeat', 2], ['perPoint', 3]];
    return getCodeSection(blob, offset, map, /*nullterminated*/true);
};
exports.getNtCodeIFBP = getNtCodeIFBP;
// the 256*-functions are used by ancient versions of 'Super Scope', 'Dynamic Movement', 'Dynamic Distance Modifier', 'Dynamic Shift'
var get256CodePFBI = function get256CodePFBI(blob, offset) {
    var map = [['init', 3], ['perFrame', 1], ['onBeat', 2], ['perPoint', 0]];
    return getCodeSection(blob, offset, map, /*nullterminated*/false, /*string max length*/256);
};
exports.get256CodePFBI = get256CodePFBI;
var get256CodeIFB = function get256CodeIFB(blob, offset) {
    var map = [['init', 0], ['perFrame', 1], ['onBeat', 2]];
    return getCodeSection(blob, offset, map, /*nullterminated*/false, /*string max length*/256);
};
var getCodeSection = function getCodeSection(blob, offset, map, nt, fixedSize) {
    if (nt === void 0) {
        nt = false;
    }
    var strings = new Array(map.length);
    var totalSize = 0;
    var strAndSize;
    var hidden = [];
    for (var i = 0, p = offset; i < map.length; i++, p += strAndSize[1]) {
        strAndSize = nt ? getNtString(blob, p) : getSizeString(blob, p, fixedSize);
        totalSize += strAndSize[1];
        strings[i] = strAndSize[0];
        if (strAndSize.length > 2) {
            hidden = hidden.concat(strAndSize[2]);
        }
    }
    var code = {};
    for (var i = 0; i < strings.length; i++) {
        code[map[i][0]] = strings[map[i][1]];
    }
    if (hidden.length > 0) {
        code['_hidden'] = hidden;
    }
    return [code, totalSize];
};
exports.getCodeSection = getCodeSection;
var getColorList = function getColorList(blob, offset) {
    var colors = [];
    var num = getUInt32(blob, offset);
    var size = sizeInt + num * sizeInt;
    while (num > 0) {
        offset += sizeInt;
        colors.push(getColor(blob, offset)[0]);
        num--;
    }
    return [colors, size];
};
exports.getColorList = getColorList;
var getColorMaps = function getColorMaps(blob, offset) {
    var mapOffset = offset + 480;
    var maps = [];
    var headerSize = 60; // 4B enabled, 4B num, 4B id, 48B filestring
    var mi = 0; // map index, might be != i when maps are skipped
    for (var i = 0; i < 8; i++) {
        var enabled = getBool(blob, offset + headerSize * i, sizeInt)[0];
        var num = getUInt32(blob, offset + headerSize * i + sizeInt);
        var map = getColorMap(blob, mapOffset, num);
        // check if it's a disabled default {0: #000000, 255: #ffffff} map, and only save it if not.
        if (!enabled && map.length === 2 && map[0].color === '#000000' && map[0].position === 0 && map[1].color === '#ffffff' && map[1].position === 255) {
            // skip this map
        } else {
            maps[mi] = {
                'index': i,
                'enabled': enabled,
                'map': map
            };
            if (allFields) {
                var id = getUInt32(blob, offset + headerSize * i + sizeInt * 2); // id of the map - not really needed.
                var mapFile = getNtString(blob, offset + headerSize * i + sizeInt * 3)[0];
                maps[mi]['id'] = id;
                maps[mi]['fileName'] = mapFile;
            }
            mi++;
        }
        mapOffset += num * sizeInt * 3;
    }
    return [maps, mapOffset - offset];
};
exports.getColorMaps = getColorMaps;
var getColorMap = function getColorMap(blob, offset, num) {
    var colorMap = [];
    for (var i = 0; i < num; i++) {
        var pos = getUInt32(blob, offset);
        var color = getColor(blob, offset + sizeInt)[0];
        offset += sizeInt * 3; // there's a 4byte id (presumably) following each color.
        colorMap[i] = { 'color': color, 'position': pos };
    }
    return colorMap;
};
exports.getColorMap = getColorMap;
var getColor = function getColor(blob, offset) {
    // Colors in AVS are saved as (A)RGB (where A is always 0).
    // Maybe one should use an alpha channel right away and set
    // that to 0xff? For now, no 4th byte means full alpha.
    var color = getUInt32(blob, offset).toString(16);
    var padding = '';
    for (var i = color.length; i < 6; i++) {
        padding += '0';
    }
    return ['#' + padding + color, sizeInt];
};
exports.getColor = getColor;
var getConvoFilter = function getConvoFilter(blob, offset, dimensions) {
    var size = dimensions[0] * dimensions[1];
    var data = new Array(size);
    for (var i = 0; i < size; i++, offset += sizeInt) {
        data[i] = getInt32(blob, offset)[0];
    }
    var matrix = { 'width': dimensions[0], 'height': dimensions[1], 'data': data };
    return [matrix, size * sizeInt];
};
exports.getConvoFilter = getConvoFilter;
// 'Text' needs this
var getSemiColSplit = function getSemiColSplit(str) {
    var strings = str.split(';');
    if (strings.length === 1) {
        return strings[0];
    } else {
        return strings;
    }
};
exports.getSemiColSplit = getSemiColSplit;
var getBufferNum = function getBufferNum(code) {
    if (code === 0) {
        return 'Current';
    }
    return code;
};
exports.getBufferNum = getBufferNum;
//# sourceMappingURL=util.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var blendmodeIn = {
    '0': 'Ignore',
    '1': 'Replace',
    '2': '50/50',
    '3': 'Maximum',
    '4': 'Additive',
    '5': 'Dest-Src',
    '6': 'Src-Dest',
    '7': 'EveryOtherLine',
    '8': 'EveryOtherPixel',
    '9': 'XOR',
    '10': 'Adjustable',
    '11': 'Multiply',
    '12': 'Buffer'
};
exports.blendmodeIn = blendmodeIn;
var blendmodeOut = {
    '0': 'Replace',
    '1': 'Ignore',
    '2': 'Maximum',
    '3': '50/50',
    '4': 'Dest-Src',
    '5': 'Additive',
    '6': 'EveryOtherLine',
    '7': 'Src-Dest',
    '8': 'XOR',
    '9': 'EveryOtherPixel',
    '10': 'Multiply',
    '11': 'Adjustable',
    // don't ask me....
    '13': 'Buffer'
};
exports.blendmodeOut = blendmodeOut;
var blendmodeBuffer = {
    '0': 'Replace',
    '1': '50/50',
    '2': 'Additive',
    '3': 'EveryOtherPixel',
    '4': 'Dest-Src',
    '5': 'EveryOtherLine',
    '6': 'XOR',
    '7': 'Maximum',
    '8': 'Minimum',
    '9': 'Src-Dest',
    '10': 'Multiply',
    '11': 'Adjustable'
};
exports.blendmodeBuffer = blendmodeBuffer;
var blendmodeRender = {
    '0': 'Replace',
    '1': 'Additive',
    '2': 'Maximum',
    '3': '50/50',
    '4': 'Dest-Src',
    '5': 'Src-Dest',
    '6': 'Multiply',
    '7': 'Adjustable',
    '8': 'XOR'
};
exports.blendmodeRender = blendmodeRender;
var blendmodePicture2 = {
    '0': 'Replace',
    '1': 'Additive',
    '2': 'Maximum',
    '3': 'Minimum',
    '4': '50/50',
    '5': 'Dest-Src',
    '6': 'Src-Dest',
    '7': 'Multiply',
    '8': 'XOR',
    '9': 'Adjustable',
    '10': 'Ignore'
};
exports.blendmodePicture2 = blendmodePicture2;
var blendmodeColorMap = {
    '0': 'Replace',
    '1': 'Additive',
    '2': 'Maximum',
    '3': 'Minimum',
    '4': '50/50',
    '5': 'Dest-Src',
    '6': 'Src-Dest',
    '7': 'Multiply',
    '8': 'XOR',
    '9': 'Adjustable'
};
exports.blendmodeColorMap = blendmodeColorMap;
var blendmodeTexer = {
    '0': 'Texture',
    '1': 'Masked Texture'
};
exports.blendmodeTexer = blendmodeTexer;
var colorMapKey = {
    '0': 'Red',
    '1': 'Green',
    '2': 'Blue',
    '3': '(R+G+B)/2',
    '4': 'MaxChannel',
    '5': '(R+G+B)/3'
};
exports.colorMapKey = colorMapKey;
var colorMapCycleMode = {
    '0': 'None (Map 1)',
    '1': 'OnBeat Random',
    '2': 'OnBeat Sequential'
};
exports.colorMapCycleMode = colorMapCycleMode;
var bufferMode = {
    '0': 'Save',
    '1': 'Restore',
    '2': 'AlternateSaveRestore',
    '3': 'AlternateRestoreSave'
};
exports.bufferMode = bufferMode;
var coordinates = {
    '0': 'Polar',
    '1': 'Cartesian'
};
exports.coordinates = coordinates;
var drawMode = {
    '0': 'Dots',
    '1': 'Lines'
};
exports.drawMode = drawMode;
var audioChannel = {
    '0': 'Left',
    '1': 'Right',
    '2': 'Center'
};
exports.audioChannel = audioChannel;
var audioSource = {
    '0': 'Waveform',
    '1': 'Spectrum'
};
exports.audioSource = audioSource;
var positionX = {
    '0': 'Left',
    '1': 'Right',
    '2': 'Center'
};
exports.positionX = positionX;
var positionY = {
    '0': 'Top',
    '1': 'Bottom',
    '2': 'Center'
};
exports.positionY = positionY;
var multiFilterEffect = {
    '0': 'Chrome',
    '1': 'Double Chrome',
    '2': 'Triple Chrome',
    '3': 'Infinite Root Multiplier + Small Border Convolution'
};
exports.multiFilterEffect = multiFilterEffect;
var bufferBlendMode = {
    '0': 'a=b (Replace)',
    '1': 'a=a+b (Additive)',
    '2': 'a=max(a,b) (Maximum)',
    '3': 'a=(a+b)/2 (50/50)',
    '4': 'a=a-b (Subtractive 1)',
    '5': 'a=b-a (Subtractive 2)',
    '6': 'a=a*b (Multiply)',
    '7': 'a=a*x+b*(1-x) (Adjustable)',
    '8': 'a=a xor b (XOR)',
    '9': 'a=min(a,b) (Minimum)',
    '10': 'a=|a-b| (Absolute difference)'
};
exports.bufferBlendMode = bufferBlendMode;
var bufferBlendBuffer = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 'Current'
};
exports.bufferBlendBuffer = bufferBlendBuffer;
var particleSystemAccelerationType = {
    '0': 'Constant',
    '1': 'Fade out by 0.9',
    '2': 'Fade out by 0.6',
    '3': 'Cosine',
    '4': 'Squared Cosine'
};
exports.particleSystemAccelerationType = particleSystemAccelerationType;
var particleSystemColorBounce = {
    '0': 'Stop',
    '1': 'Wrap each',
    '2': 'Wave each',
    '3': 'Wrap all',
    '4': 'Wave all'
};
exports.particleSystemColorBounce = particleSystemColorBounce;
// pretty much directly from vis_avs/r_trans.cpp
// [name, script code representation (if any), 0:polar/1:cartesian]
var movementEffect = {
    '0': ['None', '', 0],
    '1': ['Slight Fuzzify', '', 0],
    '2': ['Shift Rotate Left', 'x=x+1/32, // use wrap for this one', 1],
    '3': ['Big Swirl Out', 'r = r + (0.1 - (0.2 * d)),\r\nd = d * 0.96,', 0],
    '4': ['Medium Swirl', 'd = d * (0.99 * (1.0 - sin(r-$PI*0.5) / 32.0)),\r\nr = r + (0.03 * sin(d * $PI * 4)),', 0],
    '5': ['Sunburster', 'd = d * (0.94 + (cos((r-$PI*0.5) * 32.0) * 0.06)),', 0],
    '6': ['Swirl To Center', 'd = d * (1.01 + (cos((r-$PI*0.5) * 4) * 0.04)),\r\nr = r + (0.03 * sin(d * $PI * 4)),', 0],
    '7': ['Blocky Partial Out', '', 0],
    '8': ['Swirling Around Both Ways At Once', 'r = r + (0.1 * sin(d * $PI * 5)),', 0],
    '9': ['Bubbling Outward', 't = sin(d * $PI),\r\nd = d - (8*t*t*t*t*t)/sqrt((sw*sw+sh*sh)/4),', 0],
    '10': ['Bubbling Outward With Swirl', 't = sin(d * $PI),\r\nd = d - (8*t*t*t*t*t)/sqrt((sw*sw+sh*sh)/4),\r\nt=cos(d*$PI/2.0),\r\nr= r + 0.1*t*t*t,', 0],
    '11': ['5 Pointed Distro', 'd = d * (0.95 + (cos(((r-$PI*0.5) * 5.0) - ($PI / 2.50)) * 0.03)),', 0],
    '12': ['Tunneling', 'r = r + 0.04,\r\nd = d * (0.96 + cos(d * $PI) * 0.05),', 0],
    '13': ['Bleedin\'', 't = cos(d * $PI),\r\nr = r + (0.07 * t),\r\nd = d * (0.98 + t * 0.10),', 0],
    '14': ['Shifted Big Swirl Out', 'd=sqrt(x*x+y*y), r=atan2(y,x),\r\nr=r+0.1-0.2*d, d=d*0.96,\r\nx=cos(r)*d + 8/128, y=sin(r)*d,', 1],
    '15': ['Psychotic Beaming Outward', 'd = 0.15', 0],
    '16': ['Cosine Radial 3-way', 'r = cos(r * 3)', 0],
    '17': ['Spinny Tube', 'd = d * (1 - ((d - .35) * .5)),\r\nr = r + .1,', 0],
    '18': ['Radial Swirlies', 'd = d * (1 - (sin((r-$PI*0.5) * 7) * .03)),\r\nr = r + (cos(d * 12) * .03),', 0],
    '19': ['Swill', 'd = d * (1 - (sin((r - $PI*0.5) * 12) * .05)),\r\nr = r + (cos(d * 18) * .05),\r\nd = d * (1-((d - .4) * .03)),\r\nr = r + ((d - .4) * .13)', 0],
    '20': ['Gridley', 'x = x + (cos(y * 18) * .02),\r\ny = y + (sin(x * 14) * .03),', 1],
    '21': ['Grapevine', 'x = x + (cos(abs(y-.5) * 8) * .02),\r\ny = y + (sin(abs(x-.5) * 8) * .05),\r\nx = x * .95,\r\ny = y * .95,', 1],
    '22': ['Quadrant', 'y = y * ( 1 + (sin(r + $PI/2) * .3) ),\r\nx = x * ( 1 + (cos(r + $PI/2) * .3) ),\r\nx = x * .995,\r\ny = y * .995,', 1],
    '23': ['6-way Kaleida (use Wrap!)', 'y = (r*6)/($PI), x = d,', 1]
};
exports.movementEffect = movementEffect;
//# sourceMappingURL=tables.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function splitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function () {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = i >= 0 ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function (path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function (p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function (path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function () {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function (p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};

// path.relative(from, to)
// posix version
exports.relative = function (from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};

exports.basename = function (path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  return splitPath(path)[3];
};

function filter(xs, f) {
  if (xs.filter) return xs.filter(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    if (f(xs[i], i, xs)) res.push(xs[i]);
  }
  return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
  return str.substr(start, len);
} : function (str, start, len) {
  if (start < 0) start = str.length + start;
  return str.substr(start, len);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ })
/******/ ]);