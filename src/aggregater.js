import firebase from "firebase"

/**
 *  
 * @param {string} baseUrl 
 * @param {object} query 
 *          {
 *              $lookup : [{
 *                  localField: function(snapshot) return array of keys,
 *                  targetUrl : "",
 *                  as : ""
 *              }]
 *          }
 */
export default function aggregater(baseUrl, query = {}){
    var database = firebase.database();

    const lookup = query["$lookup"]
    var retObject = {}
    var listener = null
    var lookups = []
    var values = {}


    const mainFunc = snap => {
        values = snap.val()
        
        if( null == values ){
            values = {}
        }

        if(null != lookup){

            // turn off all old lookups
            lookups.forEach( e => {
                e.off()
            })

            lookups = lookup.localField(values).map( v => {
                return createLookupObj(database, retObject, lookup, v)
            })

            // Turn on
            lookups.map( l => l.on() )

        }
        
        listener( values )
    }

    retObject.update = lookupKey => {
        lookups.forEach( e => {
            lookup.attachTo(values, e.key(), e.val() )
        })

        if( null != listener ){
            listener( {...values} )
        }
    }
    retObject.setListener = cb => {
        listener = cb
    }

    
    retObject.on = () => {
        database.ref(baseUrl).on("value", mainFunc)
    }

    retObject.off = () => {
        lookups.forEach( e => {
            e.off()
            database.ref(baseUrl).off("value", mainFunc)
        })
    }
    
    return retObject
}

/**
 * 
 * @return Promise
 */
function createLookupObj(database, mainObject, lookup, key){
    
    const lookupKey = key
    const targetUrl = lookup.targetUrl(key)
    var ret = {}
    var value = {}

    const watchFunc = snap => {
        value = {...snap.val()}
        mainObject.update( lookupKey )
    }

    // Turn off the watch
    ret.off = () => {
        database.ref(targetUrl).off("value", watchFunc)
    }

    // Get Value
    ret.val = () => {
        return value
    } 

    ret.key = () => {
        return lookupKey
    }

    /**
     * 
     * @return promise
     */
    ret.on = () => {
        database.ref(targetUrl).on("value", watchFunc)        
    }

    return ret

}