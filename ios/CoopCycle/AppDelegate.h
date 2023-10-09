#import <UserNotifications/UNUserNotificationCenter.h>
#import <Expo/Expo.h>
#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : EXAppDelegateWrapper <UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
