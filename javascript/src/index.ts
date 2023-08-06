function first() {
  console.log('first(): factory evaluated');
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(target, propertyKey, descriptor);
  };
}

class TestController {
  @first()
  test(name: string) {
    console.log(name);
  }
}

const controller = new TestController();
controller.test('kkk');
