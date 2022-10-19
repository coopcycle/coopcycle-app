#import <UserNotifications/UNUserNotificationCenter.h>
#import <Expo/Expo.h>
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : EXAppDelegateWrapper <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
