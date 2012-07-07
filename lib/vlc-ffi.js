/*
 * node-ffi-vlc v0.0.3
 * Object-orientated libVLC bindings for node.js implemented in javascript using node-ffi ("ffi")
 * Not for production use, use at your own risk, do with what you will.
 * See libvlc docs for more info, http://www.videolan.org/developers/vlc/doc/doxygen/html/group__libvlc.html
 */
var EventEmitter = require('events').EventEmitter,
    StructType = require('ref-struct'),
    UnionType = require('./ref-union'),
    ref = require('ref'),
    ffi = require('ffi');

// typedef
var voidPtr = ref.refType(ref.types.void);
var libvlc_instance = ref.types.void;
var libvlc_time_t = ref.types.int64;
var libvlc_meta_t = ref.types.int; //enum (TODO)
var libvlc_state_t = ref.types.int; //enum (TODO)
var libvlc_event_manager = ref.types.void;
var libvlc_media = ref.types.void;
var libvlc_media_player = ref.types.void;
var libvlc_callback = ref.types.void;
var libvlc_instance_t = ref.refType(libvlc_instance);
var libvlc_event_manager_t = ref.refType(libvlc_event_manager);
var libvlc_media_t = ref.refType(libvlc_media);
var libvlc_media_player_t = ref.refType(libvlc_media_player);
var libvlc_callback_t = ref.refType(libvlc_callback);

var stringPtr = ref.refType(ref.types.Utf8String);
var stringPtrPtr = ref.refType(stringPtr);

var libvlc_event = StructType({
    'type': 'int',
    'p_obj': voidPtr,
    'u': UnionType({
        "media_meta_changed": StructType({
            'meta_type': libvlc_meta_t
        }),
        "media_subitem_added": StructType({
            'new_child': libvlc_media_t
        }),
        "media_duration_changed": StructType({
            'new_duration': ref.types.int64
        }),
        "media_parsed_changed": StructType({
            'new_status': ref.types.int
        }),
        "media_freed": StructType({
            'md': libvlc_media_t
        }),
        "media_state_changed": StructType({
            'new_state': libvlc_state_t
        }),

        /* media instance */
        "media_player_buffering": StructType({
            'new_cache': ref.types.float
        }),
        "media_player_position_changed": StructType({
            'new_position': ref.types.float
        }),
        "media_player_time_changed": StructType({
            'new_time': libvlc_time_t
        }),
        "media_player_title_changed": StructType({
            'new_title': ref.types.int
        }),
        "media_player_seekable_changed": StructType({
            'new_seekable': ref.types.int
        }),
        "media_player_pausable_changed": StructType({
            'new_pausable': ref.types.int
        }),
        "media_player_vout": StructType({
            'new_count': ref.types.int
        }),

        /* media list */
        "media_list_item_added": StructType({
            "item": libvlc_media_t,
            "index": ref.types.int
        }),
        "media_list_will_add_item": StructType({
            "item": libvlc_media_t,
            "index": ref.types.int
        }),
        "media_list_item_deleted": StructType({
            "item": libvlc_media_t,
            "index": ref.types.int
        }),
        "media_list_will_delete_item": StructType({
            "item": libvlc_media_t,
            "index": ref.types.int
        }),

        /* media list player */
        "media_list_player_next_item_set": StructType({
            "item": libvlc_media_t
        }),

        /* snapshot taken */
        "media_player_snapshot_taken": StructType({
            "psz_filename": stringPtr
        }),

        /* Length changed */
        "media_player_length_changed": StructType({
            "new_length": libvlc_time_t
        }),

        /* VLM media */
        "vlm_media_event": StructType({
            "psz_media_name": stringPtr,
            "psz_instance_name": stringPtr
        }),

        /* Extra MediaPlayer */
        "media_player_media_changed": StructType({
            "new_media": libvlc_media_t
        })
    })
});
var libvlc_event_t = ref.refType(libvlc_event);
var libvlc_event_t_media_player_time_changed = StructType({
    'new_time': libvlc_time_t
})

// bindings
var libVLC = new ffi.Library("libvlc", {
    // VLC Core
    "libvlc_get_version": ["string", []],
    "libvlc_get_compiler": ["string", []],
    "libvlc_get_changeset": ["string", []],
    "libvlc_new": [ libvlc_instance_t, ["int", "pointer"] ],
    "libvlc_release": [ "void", [ libvlc_instance_t ] ],

    "libvlc_add_intf": [ "int", [ libvlc_instance_t, "string"]],

    // VLC Media
    "libvlc_media_new_location": [libvlc_media_t, [libvlc_instance_t, "string"]],
    "libvlc_media_new_path": [libvlc_media_t, [libvlc_instance_t, "string"]],
    "libvlc_media_add_option": ["void", [libvlc_media_t, "string"]],
    "libvlc_media_release": ["void", [libvlc_media_t]],

    // VLC Media Player
    "libvlc_media_player_new": [libvlc_media_player_t, [libvlc_instance_t]],
    "libvlc_media_player_new_from_media": [libvlc_media_player_t, [libvlc_media_t]],
    "libvlc_media_player_play": ["int", [libvlc_media_player_t]],
    "libvlc_media_player_stop": ["void", [libvlc_media_player_t]],
    "libvlc_media_player_get_position": ["float", [libvlc_media_player_t]],
    "libvlc_media_player_set_position": ["void", [libvlc_media_player_t, "float"]],
    "libvlc_media_player_release": ["void", [libvlc_media_player_t]],
    "libvlc_media_player_event_manager": [libvlc_event_manager_t, [libvlc_media_player_t]],

    // VLC Video Controls
    "libvlc_video_take_snapshot": ["int", [libvlc_media_player_t, "uint", "string", "uint", "uint"]],

    // VLC Events
    "libvlc_event_attach": ["int", [libvlc_event_manager_t, "int", libvlc_callback_t, voidPtr]],
    "libvlc_event_detach": ["void", [libvlc_event_manager_t, "int", libvlc_callback_t, voidPtr]]
});

// helper function (TODO: move to external module)
function arrayToArgv(data) {
    var array = new Buffer(ref.sizeof.pointer * data.length);
    for (var i = 0; i < data.length; i++) 
        array.writePointer((new Buffer(data[i]+"\0")), ref.sizeof.pointer * i)
    return array;
}

var VLC = module.exports = function() {
    var parent = this;    
    if (!arguments.length) 
        this.inst = libVLC.libvlc_new(0, null);
    else
        this.inst = libVLC.libvlc_new(arguments.length, arrayToArgv(arguments));

    if (this.inst.isNull()) throw new Error("Library Error: NULL returned");

    this.addIntf = function(name) {
        libVLC.libvlc_add_intf(parent.inst, name);
    }

    this.Media = function(inst) {
        if (inst instanceof Buffer && !inst.isNull()) {
            this.inst = inst;
        } else {
            throw new Error("TypeError: Invalid parameters");
        }
        if (this.inst.address == 0) throw new Error("Library Error: NULL returned");
    };
    this.Media.fromLocation = function(location) {
        return new parent.Media( libVLC.libvlc_media_new_location(parent.inst, location) );
    };
    this.Media.fromPath = function(path) {
        return new parent.Media( libVLC.libvlc_media_new_path(parent.inst, path) );
    };
    this.Media.prototype.addOption = function(options) {
        libVLC.libvlc_media_add_option(this.inst, options);
    };
    this.Media.prototype.release = function() {
        libVLC.libvlc_media_release(this.inst);
    };
    this.MediaPlayer = function(inst) {
        if (inst instanceof Buffer) {
            this.inst = inst;
        } else if (inst instanceof parent.Media) {
            this.inst = libVLC.libvlc_media_player_new_from_media(inst.inst);
        } else if (arguments.length != 0) {
            throw new Error("TypeError: Invalid parameters");
        } else {
            this.inst = libVLC.libvlc_media_player_new(parent.inst);
        }
        if (this.inst.isNull()) throw new Error("Library Error: NULL returned");

        // set up events
        this.event_manager = libVLC.libvlc_media_player_event_manager(this.inst);
        if (this.event_manager.isNull()) throw new Error("Library Error: NULL returned");
        this.attachedCallbacks = [];
        this.on('newListener', Events.onNewListener('MediaPlayer').bind(this));
    };
    this.MediaPlayer.prototype.__proto__ = EventEmitter.prototype;
    this.MediaPlayer.prototype.play = function() {
        libVLC.libvlc_media_player_play(this.inst);
    };
    this.MediaPlayer.prototype.stop = function() {
        libVLC.libvlc_media_player_stop(this.inst);
    };
    this.MediaPlayer.prototype.getPosition = function() {
        return libVLC.libvlc_media_player_get_position(this.inst);
    };
    this.MediaPlayer.prototype.setPosition = function(position) {
        if (typeof position !== 'number') throw new Error("TypeError: Invalid parameters");
        libVLC.libvlc_media_player_set_position(this.inst, position);
    };
    this.MediaPlayer.prototype.release = function() {
        Events.detachAll.call(this);
        libVLC.libvlc_media_player_release(this.inst);
    };
    this.MediaPlayer.prototype.takeSnapshot = function(path, width, height, output) {
        return (libVLC.libvlc_video_take_snapshot(this.inst, output || 0, path, width || 0, height || 0) == 0);
    };
    this.MediaPlayer.prototype.__defineGetter__('position', this.MediaPlayer.prototype.getPosition);
    this.MediaPlayer.prototype.__defineSetter__('position', this.MediaPlayer.prototype.setPosition);

    var Events = {
        // Source: libvlc_event_e enum at http://www.videolan.org/developers/vlc/doc/doxygen/html/libvlc__events_8h_source.html
        Map: {
            "MediaPlayerMediaChanged":     0x100,
            "MediaPlayerNothingSpecial":   0x101,
            "MediaPlayerOpening":          0x102,
            "MediaPlayerBuffering":        0x103,
            "MediaPlayerPlaying":          0x104,
            "MediaPlayerPaused":           0x105,
            "MediaPlayerStopped":          0x106,
            "MediaPlayerForward":          0x107,
            "MediaPlayerBackward":         0x108,
            "MediaPlayerEndReached":       0x109,
            "MediaPlayerEncounteredError": 0x10a,
            "MediaPlayerTimeChanged":      0x10b,
            "MediaPlayerPositionChanged":  0x10c,
            "MediaPlayerSeekableChanged":  0x10d,
            "MediaPlayerPausableChanged":  0x10e,
            "MediaPlayerTitleChanged":     0x10f,
            "MediaPlayerSnapshotTaken":    0x110,
            "MediaPlayerLengthChanged":    0x111,
            "MediaPlayerVout":             0x112
        },
        // See http://www.videolan.org/developers/vlc/doc/doxygen/html/structlibvlc__event__t.html for union specs
        CallbackHandlers: {
            "MediaPlayerTimeChanged": function(u) {
                var timeChangedEvent = u.media_player_time_changed;
                return this.emit("MediaPlayerTimeChanged", timeChangedEvent.new_time);
            }
        },
        callback: function(evPtr) {
            var ev = new libvlc_event(evPtr);
            var type = ev.type;
            var objPtr = ev.u;
            for (event in Events.Map) {
                if (type == Events.Map[event]){
                    if (Events.CallbackHandlers[event]) {
                        return Events.CallbackHandlers[event].call(this, objPtr);
                    } else {
                        return this.emit(event);
                    }
                }
            }
        },
        attach: function(type, callback) {
            var cbPtr = new ffi.Callback("void", [libvlc_event_t, "pointer"], callback);
            if (libVLC.libvlc_event_attach(this.event_manager, type, cbPtr, null) == 0)
                this.attachedCallbacks.push({callback: cbPtr, type: type});
        },
        detachAll: function() {
            this.attachedCallbacks.forEach(Events.detach.bind(this));
        },
        detach: function(ev) {
            if (!ev || ev.callback.isNull()) return;
            libVLC.libvlc_event_detach(this.event_manager, ev.type, ev.callback, null);
        },
        onNewListener: function(moduleName) {
            var len = moduleName.length;
            return function(ev, fn) {
                // filter out events - only capture/respond to those that start with the module name
                // and find the event type number
                var type;
                if (typeof ev === 'string' && ev.substring(0, len) == moduleName) {
                    type = Events.Map[ev];
                }//TODO typeof == number
                if (!type) return;
                
                // record all callbacks so they can be detached later
                Events.attach.call(this, type, Events.callback.bind(this));
            };
        }
    }
};
VLC.prototype.release = function() {
    libVLC.libvlc_release(this.inst);
};
VLC.__defineGetter__('version', function() {
    return libVLC.libvlc_get_version();
});
VLC.__defineGetter__('compiler', function() {
    return libVLC.libvlc_get_compiler();
});
VLC.__defineGetter__('changeset', function() {
    return libVLC.libvlc_get_changeset();
});
