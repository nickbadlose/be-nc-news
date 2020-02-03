const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an eempty array when passed an empty array", () => {
    const actual = formatDates([]);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it("when passed an array with one object, returns the object with correctly formatted date inside", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actual = formatDates(input);
    const output = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2018-11-15T12:21:54.171Z",
        votes: 100
      }
    ];
    expect(actual).to.eql(output);
  });
  it("when passed an array with multiple objects, returns the array with all objects with correctly formatted date inside", () => {
    const input = [
      {
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: 406988514171
      },
      {
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: 280844514171
      },
      {
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: 154700514171
      }
    ];
    const actual = formatDates(input);
    const output = [
      {
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: "1982-11-24T12:21:54.171Z"
      },
      {
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: "1978-11-25T12:21:54.171Z"
      },
      {
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: "1974-11-26T12:21:54.171Z"
      }
    ];
    expect(actual).to.eql(output);
  });
  it("original array has not been mutated", () => {
    const input = [
      {
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: 406988514171
      }
    ];
    formatDates(input);
    expect(input).to.eql([
      {
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: 406988514171
      }
    ]);
  });
  it("objects have not been mutated", () => {
    const input = [
      {
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: 406988514171
      }
    ];
    formatDates(input);
    expect(input[0]).to.eql({
      title: "Seven inspirational thought leaders from Manchester UK",
      topic: "mitch",
      author: "rogersop",
      body: "Who are we kidding, there is only one, and it's Mitch!",
      created_at: 406988514171
    });
  });
  it("output has a different reference from input", () => {
    const input = [
      {
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: 406988514171
      }
    ];
    const actual = formatDates(input);
    expect(input).to.not.equal(actual);
    expect(input[0]).to.not.equal(actual[0]);
  });
});

describe("makeRefObj", () => {
  it("when passed an empty array, returns an empty object", () => {
    const actual = makeRefObj([]);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it("when passed an array with one object, returns a reference object with one reference key value pair inside", () => {
    const input = [
      {
        article_id: 12,
        title: "Moustache",
        body: "Have you seen the size of that thing?",
        votes: 0,
        topic: "mitch",
        author: "butter_bridge",
        created_at: "1974-11-26T12:21:54.171Z"
      }
    ];
    const actual = makeRefObj(input, "title", "article_id");
    const expected = { Moustache: 12 };
    expect(actual).to.eql(expected);
  });
  it("when passed an array of objects, returns a reference object with multiple reference key value pairs inside", () => {
    const input = [
      {
        article_id: 10,
        title: "Seven inspirational thought leaders from Manchester UK",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        votes: 0,
        topic: "mitch",
        author: "rogersop",
        created_at: "1982-11-24T12:21:54.171Z"
      },
      {
        article_id: 11,
        title: "Am I a cat?",
        body:
          "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        votes: 0,
        topic: "mitch",
        author: "icellusedkars",
        created_at: "1978-11-25T12:21:54.171Z"
      },
      {
        article_id: 12,
        title: "Moustache",
        body: "Have you seen the size of that thing?",
        votes: 0,
        topic: "mitch",
        author: "butter_bridge",
        created_at: "1974-11-26T12:21:54.171Z"
      }
    ];
    const actual = makeRefObj(input, "title", "article_id");
    const expected = {
      Moustache: 12,
      "Seven inspirational thought leaders from Manchester UK": 10,
      "Am I a cat?": 11
    };
    expect(actual).to.eql(expected);
  });
  it("does not mutate the input array", () => {
    const input = [
      {
        article_id: 12,
        title: "Moustache",
        body: "Have you seen the size of that thing?",
        votes: 0,
        topic: "mitch",
        author: "butter_bridge",
        created_at: "1974-11-26T12:21:54.171Z"
      }
    ];
    makeRefObj(input, "title", "article_id");
    expect(input).to.eql([
      {
        article_id: 12,
        title: "Moustache",
        body: "Have you seen the size of that thing?",
        votes: 0,
        topic: "mitch",
        author: "butter_bridge",
        created_at: "1974-11-26T12:21:54.171Z"
      }
    ]);
  });
  it("does not mutate the the objects in the input array", () => {
    const input = [
      {
        article_id: 12,
        title: "Moustache",
        body: "Have you seen the size of that thing?",
        votes: 0,
        topic: "mitch",
        author: "butter_bridge",
        created_at: "1974-11-26T12:21:54.171Z"
      }
    ];
    makeRefObj(input, "title", "article_id");
    expect(input[0]).to.eql({
      article_id: 12,
      title: "Moustache",
      body: "Have you seen the size of that thing?",
      votes: 0,
      topic: "mitch",
      author: "butter_bridge",
      created_at: "1974-11-26T12:21:54.171Z"
    });
  });
});

describe("formatComments", () => {
  it("returns an empty array when passed an empty array", () => {
    const actual = formatComments([]);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it("when passed an array with one comment object inside, returns an array with a correctly formatted comment inside", () => {
    const input = [
      {
        body: "This is a bad article name",
        belongs_to: "A",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1038314163389
      }
    ];
    const refObj = { A: 6 };
    const actual = formatComments(input, refObj, "article_id", "belongs_to");
    const expected = [
      {
        body: "This is a bad article name",
        article_id: 6,
        author: "butter_bridge",
        votes: 1,
        created_at: "2002-11-26T12:36:03.389Z"
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("when passed an array with mulltiple comment objects inside, returns an array with correctly formatted comment objects inside", () => {
    const input = [
      {
        body: "This is a bad article name",
        belongs_to: "A",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1038314163389
      },
      {
        body: "The owls are not what they seem.",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "icellusedkars",
        votes: 20,
        created_at: 1006778163389
      },
      {
        body: "Fruit pastilles",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1132922163389
      }
    ];
    const refObj = {
      A: 6,
      "They're not exactly dogs, are they?": 9,
      "Living in the shadow of a great man": 1
    };
    const actual = formatComments(input, refObj, "article_id", "belongs_to");
    const expected = [
      {
        body: "This is a bad article name",
        article_id: 6,
        author: "butter_bridge",
        votes: 1,
        created_at: "2002-11-26T12:36:03.389Z"
      },
      {
        body: "The owls are not what they seem.",
        article_id: 9,
        author: "icellusedkars",
        votes: 20,
        created_at: "2001-11-26T12:36:03.389Z"
      },
      {
        body: "Fruit pastilles",
        article_id: 1,
        author: "icellusedkars",
        votes: 0,
        created_at: "2005-11-25T12:36:03.389Z"
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("does not mutate input array", () => {
    const input = [
      {
        body: "This is a bad article name",
        belongs_to: "A",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1038314163389
      }
    ];
    const refObj = { A: 6 };
    formatComments(input, refObj, "article_id", "belongs_to");
    expect(input).to.eql([
      {
        body: "This is a bad article name",
        belongs_to: "A",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1038314163389
      }
    ]);
  });
  it("does not mutate comment objects in input array", () => {
    const input = [
      {
        body: "This is a bad article name",
        belongs_to: "A",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1038314163389
      }
    ];
    const refObj = { A: 6 };
    formatComments(input, refObj, "article_id", "belongs_to");
    expect(input[0]).to.eql({
      body: "This is a bad article name",
      belongs_to: "A",
      created_by: "butter_bridge",
      votes: 1,
      created_at: 1038314163389
    });
  });
  it("output array has a different reference from input array", () => {
    const input = [
      {
        body: "This is a bad article name",
        belongs_to: "A",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1038314163389
      }
    ];
    const refObj = { A: 6 };
    const output = formatComments(input, refObj, "article_id", "belongs_to");
    expect(input).to.not.equal(output);
  });
});
