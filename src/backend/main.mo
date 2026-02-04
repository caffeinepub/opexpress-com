import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type PostId = Nat;

  type Post = {
    id : PostId;
    content : Text;
    media : ?Storage.ExternalBlob;
    hashtags : [Text];
    timestamp : Int;
  };

  module Post {
    public func compare(post1 : Post, post2 : Post) : Order.Order {
      Nat.compare(post1.id, post2.id);
    };

    public func compareByTimestamp(post1 : Post, post2 : Post) : Order.Order {
      Int.compare(post1.timestamp, post2.timestamp);
    };
  };

  var nextPostId = 0;
  let posts = Map.empty<PostId, Post>();

  // Helper to parse hashtags from content
  func extractHashtags(content : Text) : [Text] {
    content.tokens(#char ' ').filter(
      func(word) {
        let chars = word.chars();
        switch (chars.next()) {
          case (?firstChar) {
            firstChar == '#';
          };
          case (null) { false };
        };
      }
    ).map(
        func(tag) {
          // Remove all leading '#' characters (should be at least one non-'#' character left)
          tag.trimStart(#char '#');
        }
      ).toArray();
  };

  public shared ({ caller = _ }) func createPost(content : Text, media : ?Storage.ExternalBlob) : async PostId {
    let hashtags = extractHashtags(content);
    let newPost : Post = {
      id = nextPostId;
      content;
      media;
      hashtags;
      timestamp = Time.now();
    };

    posts.add(nextPostId, newPost);
    nextPostId += 1;
    newPost.id;
  };

  public query ({ caller = _ }) func getPost(id : PostId) : async Post {
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) { post };
    };
  };

  public query ({ caller = _ }) func getAllPosts() : async [Post] {
    posts.values().toArray().sort(Post.compareByTimestamp);
  };

  public query ({ caller = _ }) func getPostsByHashtag(hashtag : Text) : async [Post] {
    posts.values().toArray().filter(
      func(post) {
        post.hashtags.find(func(tag) { Text.equal(tag, hashtag) }) != null;
      }
    );
  };
};
