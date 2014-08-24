/**
 * Directive `unique-email`.
 * Checks if entered email does not exist on the server.
 *
 * Example of usage:
 * <form name="testForm" novalidate>
 *   <input class="test-email" type="email" ng-model="user.email" name="email"
 *          data-unique-email="/account/:email/free" data-unique-email-timeout="1000">,
 *   <button ng-disabled="testForm.$invalid">Send</button>,
 * </form>'
 *
 * Changes validity of %field%.$error.unique and %field%.$error.uniqueHelper.
 */


/**
 * Checks that `x` is not `null` or `undefined`.
 * @return {Boolean}
 */
var isDefined = function isDefined ( x ) {
    return ( null !== x ) && ( undefined !== x );
};


/**
 * Returns value by path or null if path's chain has undefined member.
 * @param {Object} source - root object.
 * @param {string} path - path to `source` value.
 * @return {Object}
 */
var getOrNull = function getOrNull ( source, path ) {
    if ( undefined === source ) return null;

    var tokens = path.split( '.' )
      , idx, key;

    for ( idx in tokens ) {
        key = tokens[ idx ];

        if ( isDefined( source[key] ) ) 
            source = source[ key ];
        else 
            return null;
    }

    return source;
};


angular.module( 'directives' )
    .directive( 'uniqueEmail', [ '$http', '$interval', function ( $http, $interval ) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function ( $scope, element, attrs, ctrl ) {
                var DEFAULT_DELAY = 500
                  , delay = parseInt( attrs.uniqueEmailTimeout ) || DEFAULT_DELAY
                  , url = attrs.uniqueEmail
                  , _isTimerRun = false
                  , _interval;
                
                var checkEmail = function checkEmail ( url, email ) {
                    return $http({
                        method: 'GET',
                        url: url,
                        responseType: 'json'
                    });
                };

                $scope.$watch( attrs.ngModel, function ( newEmail ) {
                    // Unique checking is not perform yet, so we
                    // mark email field as invalid by default.
                    // This is usefull when we want to block some 
                    // element of the form (e.g. button "Send"), 
                    // while we waiting for the async response 
                    // from server.
                    ctrl.$setValidity( 'uniqueHelper', false ); 
                    ctrl.$setValidity( 'unique', true ); 

                    // Cancel previously started timer, because it is
                    // outdated now.
                    if ( _isTimerRun ) {
                        _isTimerRun = false;
                        $interval.cancel( _interval );
                    }

                    if ( ctrl.$error.email || (newEmail === '') || !isDefined( newEmail ) )
                        return;
                    
                    var completeUrl = url.replace( ':email', newEmail );
                    
                    // Start new interval to check email uniqueness
                    // after `delay`
                    _interval = $interval(function () {
                        checkEmail( completeUrl, newEmail )
                            .then(function ( resp ) {
                                var isEmailFree = getOrNull( resp, 'data.success' ) || false;
                                ctrl.$setValidity( 'unique', isEmailFree );
                                ctrl.$setValidity( 'uniqueHelper', isEmailFree ); 
                            }, function ( err ) {
                                throw new Error( err );
                            });
                    }, delay, 1 );
                    
                    // Mark interval as runned.
                    _isTimerRun = true;
                }, true );
            }
        };
    }] );
