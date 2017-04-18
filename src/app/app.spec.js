describe('Test the mail app logic', function() {
  beforeEach(module('app'));

  var $controller;
  var $scope;
  var controller;

  beforeEach(inject(function(_$controller_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;

    $scope = {};
    controller = $controller('MainController', { $scope: $scope });
  }));

  describe('MainController', function() {
    it('should initialie the MainController', function() {

      const mockApp = {
        users_online: '-',
        games: '-',
      };

      expect(controller.app).toEqual(jasmine.any(Object));
      expect(controller.app).toEqual(mockApp);
    });
  });

  describe('serverApp constant', function() {
    var mockServerApp;

    beforeEach(inject(function(_serverApp_) {
      mockServerApp = _serverApp_;
    }));

    it('should have a serverApp object', function() {
      expect(mockServerApp).toEqual(jasmine.any(Object));
    });
  });

});
