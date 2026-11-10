// PythonPro Comprehensive Curriculum Data
// Extracted from https://stellar-marshmallow-c8bfe2.netlify.app/

export interface NoteItem {
  id: string;
  title: string;
  desc: string;
  category: 'Foundations' | 'Collections & Functions' | 'OOP & Data' | 'Advanced & Best Practices';
  readTime: string;
  body: string;
}

export interface ProgramItem {
  id: string;
  cat: 'Basics' | 'Strings' | 'Collections' | 'Functions' | string;
  title: string;
  desc: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  code: string;
  out: string;
}

export interface QuizQuestion {
  id: string;
  q: string;
  a: string[];
  correct: number;
  why: string;
}

export interface InterviewQA {
  id: string;
  category: 'Core Python' | 'Data Structures' | 'OOP & Memory' | 'Advanced & Placement';
  question: string;
  answer: string;
  frequency: 'High' | 'Very High' | 'Essential';
  companies?: string[];
  intent?: string;
  pitch?: string[];
  codeSnippet?: string;
  codeHeader?: string;
  views?: string;
}

export interface RoadmapPhase {
  phase: string;
  days: string;
  title: string;
  summary: string;
  details: string[];
  deliverable: string;
  color: string;
}


export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phase: 'Phase 1',
    days: 'Days 1–15',
    title: 'Python Foundations',
    summary: 'Syntax, variables, data types, operators, conditions, loops, and strings.',
    details: [
      'Master dynamic typing, type casting (int, float, str, bool)',
      'Arithmetic, comparison, logical, and bitwise operators',
      'If-elif-else branching and ternary conditional expressions',
      'For & while loops, range(), break, continue, pass',
      'String slicing, formatting (f-strings), immutability and methods'
    ],
    deliverable: 'Solve 25 beginner coding problems on loops and string manipulations.',
    color: '#3b82f6'
  },
  {
    phase: 'Phase 2',
    days: 'Days 16–30',
    title: 'Collections & Functions',
    summary: 'Lists, tuples, sets, dictionaries, functions, recursion, and built-ins.',
    details: [
      'List operations, in-place vs new copies, slicing tricks',
      'Tuples: immutability, packing, unpacking, tuple as dict keys',
      'Sets: hashing, union, intersection, set comprehension',
      'Dictionaries: key-value maps, dict methods, hash table internals',
      'Functions: default args, *args, **kwargs, lambda, scope (LEGB)',
      'Recursion base cases, call stack mechanics, recursion vs iteration'
    ],
    deliverable: 'Implement custom data transformations and build 15 utility algorithms.',
    color: '#8b5cf6'
  },
  {
    phase: 'Phase 3',
    days: 'Days 31–45',
    title: 'OOP & Intermediate Python',
    summary: 'Classes, inheritance, exceptions, files, comprehensions, and generators.',
    details: [
      'OOP: __init__, self, instance vs class variables, dunder methods',
      'Inheritance, multiple inheritance, Method Resolution Order (MRO)',
      'Exception hierarchy, try/except/else/finally, custom exceptions',
      'File I/O: context managers (with statement), pathlib, encoding',
      'JSON parsing and serialization (json.loads, json.dumps)',
      'List/Dict/Set comprehensions and memory-efficient generator expressions'
    ],
    deliverable: 'Build a CLI-based Student Placement Management System using OOP and JSON.',
    color: '#06b6d4'
  },
  {
    phase: 'Phase 4',
    days: 'Days 46–60',
    title: 'DSA Practice for Coding Rounds',
    summary: 'Arrays, two pointers, sliding window, searching, sorting, and complexity.',
    details: [
      'Time and Space Complexity (Big-O analysis)',
      'Two-pointer techniques for array partition and sum problems',
      'Binary Search and boundary conditions',
      'Sorting algorithms: Bubble, Insertion, Quick, Merge, Python Timsort',
      'Stack & Queue implementations using collections.deque',
      'Hash table lookups for O(1) frequency count problems'
    ],
    deliverable: 'Solve 40 targeted LeetCode/HackerRank Easy/Medium questions in Python.',
    color: '#10b981'
  },
  {
    phase: 'Phase 5',
    days: 'Days 61–70',
    title: 'Projects & Portfolio Engineering',
    summary: 'Build resume-worthy projects, write clean code, and document with Git.',
    details: [
      'Design a production Python application (REST API or Full-Stack script)',
      'Use dataclasses, type hinting (PEP 484), and unittest/pytest',
      'Organize modular package architecture with requirements.txt / pyproject.toml',
      'Write clean README with architecture diagram, setup instructions, and demo GIF',
      'Push clean commits to GitHub with standard commit conventions'
    ],
    deliverable: 'Publish 2 solid GitHub repositories with full documentation and test coverage.',
    color: '#f59e0b'
  },
  {
    phase: 'Phase 6',
    days: 'Days 71–80',
    title: 'Technical Interview Mastery',
    summary: 'Explain code aloud, answer core Python questions, and mock interviews.',
    details: [
      'Deep dive into Python internals: GIL, memory allocation, Garbage Collection',
      'Explain mutable default arguments, deepcopy vs shallow copy, closures',
      'Decorators and context manager implementation from scratch',
      'Practice whiteboard coding: clarify constraints, walk through edge cases',
      'Participate in peer mock interviews with 45-minute strict timer'
    ],
    deliverable: 'Master all 30 top placement interview questions with verbal explanations.',
    color: '#ec4899'
  },
  {
    phase: 'Phase 7',
    days: 'Days 81–90',
    title: 'Placement Drives & Applications',
    summary: 'Resume refinement, online assessments (OA), company coding rounds, HR prep.',
    details: [
      'Tailor technical resume to pass ATS with impact metrics (STAR format)',
      'Speed-test timed online assessment platforms (HackerEarth, AMCAT, CoCubes)',
      'Prepare behavioral stories for leadership, conflict, and debugging challenges',
      'Apply systematically to on-campus and off-campus tech roles',
      'Post-interview reflection and targeted weakness review'
    ],
    deliverable: 'Submit 30+ targeted applications and clear initial coding test cutoffs.',
    color: '#6366f1'
  },
  {
    phase: 'Everyday Habit',
    days: 'Daily Rhythm',
    title: 'Consistency & Active Recall',
    summary: '60–120 minutes of daily deliberate practice to build compounding muscle memory.',
    details: [
      'Morning: 30 mins code review or flashcard active recall',
      'Afternoon/Evening: 60 mins coding practice (write code without autocomplete)',
      'Review mistakes in an error-log notebook before sleeping',
      'Explain 1 complex concept to a peer or rubber duck every week'
    ],
    deliverable: 'Unbroken daily streak of coding and concept retention.',
    color: '#14b8a6'
  }
];

export const NOTES_DATA: NoteItem[] = [
  {
    "id": "note-1",
    "title": "Python Introduction",
    "desc": "What Python is, where it is used, installation, interpreter, and first program.",
    "category": "Foundations",
    "readTime": "3 min read",
    "body": "<h3>Introduction to Python</h3><p>Python is a high-level, interpreted, general-purpose programming language known for readable syntax. It is used in web development, automation, data analysis, AI, scripting, and education.</p><h4>Key features</h4><ul><li>Readable and concise syntax</li><li>Interpreted and dynamically typed</li><li>Large standard library and ecosystem</li><li>Supports procedural, object-oriented, and functional styles</li></ul><h4>First program</h4><pre>print(\"Hello, World!\")</pre><p><b>Output:</b> Hello, World!</p>"
  },
  {
    "id": "note-2",
    "title": "Variables & Data Types",
    "desc": "Names, assignment, type conversion, numeric, string, boolean, and None.",
    "category": "Foundations",
    "readTime": "3 min read",
    "body": "<h3>Variables and Data Types</h3><p>A variable is a name that refers to an object. Python infers the type at runtime.</p><pre>age = 20\nname = \"Ravi\"\nheight = 1.72\nis_student = True\nnothing = None\nprint(type(age))</pre><h4>Common types</h4><ul><li><code>int</code> — integers</li><li><code>float</code> — decimal numbers</li><li><code>str</code> — text</li><li><code>bool</code> — True or False</li><li><code>list</code>, <code>tuple</code>, <code>set</code>, <code>dict</code> — collections</li></ul><h4>Type conversion</h4><pre>number = int(\"25\")\nprice = float(\"12.5\")\ntext = str(100)</pre>"
  },
  {
    "id": "note-3",
    "title": "Operators",
    "desc": "Arithmetic, comparison, logical, assignment, membership, identity, and precedence.",
    "category": "Foundations",
    "readTime": "3 min read",
    "body": "<h3>Python Operators</h3><pre>a, b = 10, 3\nprint(a + b)   # 13\nprint(a // b)  # 3\nprint(a ** b)  # 1000\nprint(a > b)   # True\nprint(a % 2 == 0 and b > 0)</pre><h4>Operator groups</h4><ul><li>Arithmetic: <code>+ - * / // % **</code></li><li>Comparison: <code>== != &lt; &gt; &lt;= &gt;=</code></li><li>Logical: <code>and or not</code></li><li>Membership: <code>in, not in</code></li><li>Identity: <code>is, is not</code></li></ul>"
  },
  {
    "id": "note-4",
    "title": "Conditional Statements",
    "desc": "if, elif, else, nested conditions, and conditional expressions.",
    "category": "Foundations",
    "readTime": "3 min read",
    "body": "<h3>Conditions</h3><pre>marks = 82\nif marks >= 90:\n    grade = \"A\"\nelif marks >= 75:\n    grade = \"B\"\nelse:\n    grade = \"C\"\nprint(grade)</pre><p>Python uses indentation to define blocks. Keep indentation consistent, usually four spaces.</p>"
  },
  {
    "id": "note-5",
    "title": "Loops",
    "desc": "for, while, range, break, continue, pass, and loop else.",
    "category": "Foundations",
    "readTime": "3 min read",
    "body": "<h3>Loops</h3><pre>for i in range(1, 6):\n    print(i)\n\ncount = 3\nwhile count > 0:\n    print(count)\n    count -= 1</pre><ul><li><code>break</code> exits a loop.</li><li><code>continue</code> skips to the next iteration.</li><li><code>pass</code> is a placeholder statement.</li></ul>"
  },
  {
    "id": "note-6",
    "title": "Strings",
    "desc": "String indexing, slicing, methods, formatting, and immutability.",
    "category": "Foundations",
    "readTime": "3 min read",
    "body": "<h3>Strings</h3><pre>text = \"Python\"\nprint(text[0])\nprint(text[1:4])\nprint(text.upper())\nprint(f\"Learn {text}\")</pre><p>Strings are immutable: operations create new strings rather than changing existing characters.</p>"
  },
  {
    "id": "note-7",
    "title": "Lists & Tuples",
    "desc": "Sequence collections, methods, slicing, packing, and unpacking.",
    "category": "Collections & Functions",
    "readTime": "3 min read",
    "body": "<h3>Lists and Tuples</h3><pre>numbers = [3, 1, 2]\nnumbers.append(4)\nnumbers.sort()\nprint(numbers)\npoint = (10, 20)\nx, y = point</pre><p>Lists are mutable. Tuples are immutable. Both preserve order and allow indexing.</p>"
  },
  {
    "id": "note-8",
    "title": "Sets & Dictionaries",
    "desc": "Unique values, set operations, key-value maps, and dictionary methods.",
    "category": "Collections & Functions",
    "readTime": "3 min read",
    "body": "<h3>Sets and Dictionaries</h3><pre>unique = {1, 2, 2, 3}\nprint(unique)\n\nstudent = {\"name\": \"Ravi\", \"marks\": 90}\nprint(student[\"name\"])\nstudent[\"grade\"] = \"A\"</pre><p>Sets store unique hashable values. Dictionaries map keys to values and preserve insertion order in modern Python.</p>"
  },
  {
    "id": "note-9",
    "title": "Functions",
    "desc": "def, arguments, return, default values, keyword args, *args, **kwargs, lambda.",
    "category": "Collections & Functions",
    "readTime": "3 min read",
    "body": "<h3>Functions</h3><pre>def add(a, b=0):\n    return a + b\n\nprint(add(4, 5))\n\nsquare = lambda n: n * n\nprint(square(6))</pre><p>Functions help reuse code. A return statement sends a result to the caller.</p>"
  },
  {
    "id": "note-10",
    "title": "OOP in Python",
    "desc": "Classes, objects, constructors, inheritance, encapsulation, and polymorphism.",
    "category": "OOP & Data",
    "readTime": "3 min read",
    "body": "<h3>Object-Oriented Programming</h3><pre>class Student:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        return f\"Hello {self.name}\"\n\ns = Student(\"Ravi\")\nprint(s.greet())</pre><h4>Core ideas</h4><ul><li>Class: blueprint for objects</li><li>Object: instance of a class</li><li>Inheritance: reuse/extend class behavior</li><li>Polymorphism: common interface, varying behavior</li><li>Encapsulation: organize and protect implementation details</li></ul>"
  },
  {
    "id": "note-11",
    "title": "Exceptions & Files",
    "desc": "try/except/else/finally, raising errors, reading and writing files.",
    "category": "OOP & Data",
    "readTime": "3 min read",
    "body": "<h3>Exceptions and Files</h3><pre>try:\n    value = int(\"abc\")\nexcept ValueError:\n    print(\"Invalid number\")\n\nwith open(\"notes.txt\", \"w\", encoding=\"utf-8\") as file:\n    file.write(\"Python notes\")</pre><p>Use <code>with</code> to manage files safely. Handle specific exceptions whenever possible.</p>"
  },
  {
    "id": "note-12",
    "title": "Modules & Packages",
    "desc": "import, standard library, pip, virtual environments, and package structure.",
    "category": "OOP & Data",
    "readTime": "3 min read",
    "body": "<h3>Modules and Packages</h3><pre>import math\nprint(math.sqrt(25))\n\nfrom datetime import date\nprint(date.today())</pre><p>A module is a Python file. A package groups modules. Use virtual environments to isolate project dependencies.</p>"
  },
  {
    "id": "note-13",
    "title": "Comprehensions & Iterators",
    "desc": "List/dict/set comprehensions, iter, next, generators, yield.",
    "category": "Collections & Functions",
    "readTime": "3 min read",
    "body": "<h3>Comprehensions and Generators</h3><pre>squares = [n*n for n in range(5)]\nevens = {n for n in range(10) if n % 2 == 0}\n\ndef count_up(limit):\n    for n in range(limit):\n        yield n</pre><p>Generators produce values lazily, which can reduce memory use for large sequences.</p>"
  },
  {
    "id": "note-14",
    "title": "Useful Advanced Concepts",
    "desc": "Decorators, context managers, typing, dataclasses, and complexity basics.",
    "category": "Advanced & Best Practices",
    "readTime": "3 min read",
    "body": "<h3>Advanced Concepts</h3><pre>def announce(func):\n    def wrapper(*args, **kwargs):\n        print(\"Starting\")\n        return func(*args, **kwargs)\n    return wrapper\n\n@announce\ndef greet():\n    print(\"Hello\")\ngreet()</pre><p>Explore decorators, context managers, type hints, dataclasses, testing, and algorithm complexity as you progress.</p>"
  },
  {
    "id": "note-15",
    "title": "Scope & Namespaces",
    "desc": "Local, enclosing, global, and built-in scopes; the LEGB lookup order.",
    "category": "Advanced & Best Practices",
    "readTime": "3 min read",
    "body": "<h3>Scope and Namespaces</h3><p>When Python resolves a name, it searches the Local, Enclosing, Global, and Built-in scopes in that order. A function creates a local scope.</p><pre>message = \"global\"\ndef show_message():\n    message = \"local\"\n    print(message)\nshow_message()\nprint(message)</pre><p>Use <code>global</code> or <code>nonlocal</code> only when a function truly needs to rebind an outer name.</p>"
  },
  {
    "id": "note-16",
    "title": "Recursion",
    "desc": "Base cases, recursive calls, stack depth, and when iteration is simpler.",
    "category": "Collections & Functions",
    "readTime": "3 min read",
    "body": "<h3>Recursion</h3><p>A recursive function solves a problem by calling itself on a smaller input. Every recursive path needs a base case that stops the calls.</p><pre>def factorial(n):\n    if n &lt; 2:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))</pre><p>Deep recursion uses the call stack. For large inputs, an iterative solution may be safer.</p>"
  },
  {
    "id": "note-17",
    "title": "Error Handling Patterns",
    "desc": "Specific exceptions, else, finally, raising errors, and custom exceptions.",
    "category": "OOP & Data",
    "readTime": "3 min read",
    "body": "<h3>Error Handling</h3><p>Catch only errors you can handle, and keep the protected block small. The <code>else</code> block runs when no exception was raised; <code>finally</code> runs during cleanup.</p><pre>try:\n    quantity = int(\"12\")\nexcept ValueError as error:\n    print(\"Enter a whole number:\", error)\nelse:\n    print(quantity)\nfinally:\n    print(\"Finished\")</pre>"
  },
  {
    "id": "note-18",
    "title": "File Paths & Context Managers",
    "desc": "Portable paths with pathlib and safe resource cleanup with with.",
    "category": "OOP & Data",
    "readTime": "3 min read",
    "body": "<h3>Paths and Context Managers</h3><p><code>pathlib.Path</code> provides readable path operations across operating systems. A context manager makes sure a resource is cleaned up when its block exits.</p><pre>from pathlib import Path\n\npath = Path(\"data\") / \"notes.txt\"\npath.parent.mkdir(exist_ok=True)\nwith path.open(\"w\", encoding=\"utf-8\") as file:\n    file.write(\"Practice every day\")</pre>"
  },
  {
    "id": "note-19",
    "title": "JSON Data",
    "desc": "Encode Python values as JSON and safely parse JSON text.",
    "category": "OOP & Data",
    "readTime": "3 min read",
    "body": "<h3>Working with JSON</h3><p>JSON is a text format for exchanging structured data. The standard <code>json</code> module converts supported Python values to and from JSON text.</p><pre>import json\n\nstudent = {\"name\": \"Asha\", \"score\": 92}\ntext = json.dumps(student)\nrestored = json.loads(text)\nprint(restored[\"name\"])</pre><p>Use <code>json.load</code> and <code>json.dump</code> to work directly with file objects.</p>"
  },
  {
    "id": "note-20",
    "title": "Type Hints",
    "desc": "Annotate parameters, return values, collections, and optional values.",
    "category": "Advanced & Best Practices",
    "readTime": "3 min read",
    "body": "<h3>Type Hints</h3><p>Type hints document the kinds of values a function expects and returns. Python does not enforce ordinary annotations at runtime, but editors and checkers can use them.</p><pre>def average(values: list[float]) -&gt; float:\n    return sum(values) / len(values)\n\nprint(average([80.0, 90.0]))</pre><p>Use precise annotations to make APIs easier to understand and maintain.</p>"
  },
  {
    "id": "note-21",
    "title": "Dataclasses",
    "desc": "Create clear data-focused classes with generated initialization and repr.",
    "category": "Advanced & Best Practices",
    "readTime": "3 min read",
    "body": "<h3>Dataclasses</h3><p>For classes primarily used to hold data, <code>dataclasses</code> can generate common methods such as initialization and a useful representation.</p><pre>from dataclasses import dataclass\n\n@dataclass\nclass Course:\n    title: str\n    lessons: int\n\ncourse = Course(\"Python Basics\", 12)\nprint(course.title)</pre>"
  },
  {
    "id": "note-22",
    "title": "Unit Testing",
    "desc": "Test expected behavior with assertions and Python's unittest framework.",
    "category": "Advanced & Best Practices",
    "readTime": "3 min read",
    "body": "<h3>Unit Testing</h3><p>Small tests check behavior and help catch regressions. A good test verifies an observable result for one clear scenario.</p><pre>import unittest\n\ndef add(a, b):\n    return a + b\n\nclass AddTests(unittest.TestCase):\n    def test_adds_two_numbers(self):\n        self.assertEqual(add(2, 3), 5)</pre><p>Run tests frequently and include normal, boundary, and invalid-input cases.</p>"
  },
  {
    "id": "note-23",
    "title": "Sorting & Key Functions",
    "desc": "Sort lists in place or create a sorted copy using a key function.",
    "category": "Collections & Functions",
    "readTime": "3 min read",
    "body": "<h3>Sorting Collections</h3><p>Use <code>sorted</code> to create a new ordered list, or <code>list.sort</code> to sort a list in place. The <code>key</code> parameter lets you choose what to compare.</p><pre>students = [(\"Mina\", 88), (\"Arun\", 95), (\"Lee\", 82)]\nranked = sorted(students, key=lambda student: student[1], reverse=True)\nprint(ranked[0][0])</pre><p>Python sorting is stable, so equal keys keep their previous relative order.</p>"
  },
  {
    "id": "note-24",
    "title": "Regular Expressions",
    "desc": "Use re search, match, findall, and raw strings for text patterns.",
    "category": "Advanced & Best Practices",
    "readTime": "3 min read",
    "body": "<h3>Regular Expressions</h3><p>The <code>re</code> module matches text patterns. Raw strings make regular-expression backslashes easier to read.</p><pre>import re\n\ntext = \"Order 104 and order 205\"\nids = re.findall(r\"\\d+\", text)\nprint(ids)</pre><p>For simple prefix or substring checks, ordinary string methods are usually clearer.</p>"
  }
];

export const PROGRAMS_DATA: ProgramItem[] = [
  {
    "id": "prog-1",
    "cat": "Basics",
    "title": "Even or Odd",
    "desc": "Check whether an integer is even.",
    "difficulty": "Easy",
    "code": "n = 14\\nif n % 2 == 0:\\n    print('Even')\\nelse:\\n    print('Odd')",
    "out": "Even"
  },
  {
    "id": "prog-2",
    "cat": "Basics",
    "title": "Factorial",
    "desc": "Calculate factorial using a loop.",
    "difficulty": "Easy",
    "code": "n = 5\\nfact = 1\\nfor i in range(1, n + 1):\\n    fact *= i\\nprint(fact)",
    "out": "120"
  },
  {
    "id": "prog-3",
    "cat": "Basics",
    "title": "Prime Number",
    "desc": "Check whether a number is prime.",
    "difficulty": "Easy",
    "code": "n = 17\\nis_prime = n > 1\\nfor i in range(2, int(n ** 0.5) + 1):\\n    if n % i == 0:\\n        is_prime = False\\n        break\\nprint('Prime' if is_prime else 'Not prime')",
    "out": "Prime"
  },
  {
    "id": "prog-4",
    "cat": "Strings",
    "title": "Palindrome String",
    "desc": "Check if text reads the same backward.",
    "difficulty": "Easy",
    "code": "text = 'madam'\\nprint('Palindrome' if text == text[::-1] else 'Not palindrome')",
    "out": "Palindrome"
  },
  {
    "id": "prog-5",
    "cat": "Strings",
    "title": "Reverse a String",
    "desc": "Reverse a string using slicing.",
    "difficulty": "Easy",
    "code": "text = 'Python'\\nprint(text[::-1])",
    "out": "nohtyP"
  },
  {
    "id": "prog-6",
    "cat": "Collections",
    "title": "Largest in a List",
    "desc": "Find the maximum list element.",
    "difficulty": "Easy",
    "code": "numbers = [12, 4, 27, 8]\\nprint(max(numbers))",
    "out": "27"
  },
  {
    "id": "prog-7",
    "cat": "Collections",
    "title": "Remove Duplicates",
    "desc": "Get unique values from a list.",
    "difficulty": "Easy",
    "code": "items = [1, 2, 2, 3, 1]\\nprint(list(dict.fromkeys(items)))",
    "out": "[1, 2, 3]"
  },
  {
    "id": "prog-8",
    "cat": "Functions",
    "title": "Fibonacci Series",
    "desc": "Print first n Fibonacci values.",
    "difficulty": "Medium",
    "code": "n = 7\\na, b = 0, 1\\nfor _ in range(n):\\n    print(a, end=' ')\\n    a, b = b, a + b",
    "out": "0 1 1 2 3 5 8"
  },
  {
    "id": "prog-9",
    "cat": "Basics",
    "title": "Sum of Digits",
    "desc": "Add the digits in a positive whole number.",
    "difficulty": "Easy",
    "code": "number = 583\\ntotal = 0\\nwhile number:\\n    total += number % 10\\n    number //= 10\\nprint(total)",
    "out": "16"
  },
  {
    "id": "prog-10",
    "cat": "Basics",
    "title": "Multiplication Table",
    "desc": "Print the first ten multiples of a number.",
    "difficulty": "Easy",
    "code": "number = 6\\nfor i in range(1, 11):\\n    print(number, 'x', i, '=', number * i)",
    "out": "6 x 1 = 6 ... 6 x 10 = 60"
  },
  {
    "id": "prog-11",
    "cat": "Strings",
    "title": "Count Vowels",
    "desc": "Count vowels in a word without case sensitivity.",
    "difficulty": "Easy",
    "code": "text = 'Python Practice'\\nvowels = 'aeiou'\\ncount = sum(1 for char in text.lower() if char in vowels)\\nprint(count)",
    "out": "4"
  },
  {
    "id": "prog-12",
    "cat": "Strings",
    "title": "Character Frequency",
    "desc": "Count how often each character appears.",
    "difficulty": "Easy",
    "code": "text = 'banana'\\nfor char in sorted(set(text)):\\n    print(char, text.count(char))",
    "out": "a 3, b 1, n 2"
  },
  {
    "id": "prog-13",
    "cat": "Collections",
    "title": "Second Largest",
    "desc": "Find the second-largest distinct number in a list.",
    "difficulty": "Easy",
    "code": "numbers = [8, 3, 12, 12, 5]\\nunique = sorted(set(numbers))\\nprint(unique[-2])",
    "out": "8"
  },
  {
    "id": "prog-14",
    "cat": "Collections",
    "title": "Merge Dictionaries",
    "desc": "Combine two dictionaries, with the second overriding duplicates.",
    "difficulty": "Easy",
    "code": "first = {'a': 1, 'b': 2}\\nsecond = {'b': 8, 'c': 3}\\nmerged = first | second\\nprint(merged)",
    "out": "{'a': 1, 'b': 8, 'c': 3}"
  },
  {
    "id": "prog-15",
    "cat": "Functions",
    "title": "Anagram Check",
    "desc": "Check whether two words contain the same letters.",
    "difficulty": "Easy",
    "code": "first = 'listen'\\nsecond = 'silent'\\nprint(sorted(first) == sorted(second))",
    "out": "True"
  },
  {
    "id": "prog-16",
    "cat": "Functions",
    "title": "Recursive Power",
    "desc": "Calculate a non-negative integer power recursively.",
    "difficulty": "Easy",
    "code": "def power(base, exponent):\\n    if exponent == 0:\\n        return 1\\n    return base * power(base, exponent - 1)\\nprint(power(2, 5))",
    "out": "32"
  },
  {
    "id": "prog-17",
    "cat": "Collections",
    "title": "Word Count",
    "desc": "Count words in a sentence using split.",
    "difficulty": "Easy",
    "code": "sentence = 'learn Python by writing code'\\nwords = sentence.split()\\nprint(len(words))",
    "out": "5"
  },
  {
    "id": "prog-18",
    "cat": "Basics",
    "title": "Leap Year",
    "desc": "Check leap years using the Gregorian calendar rules.",
    "difficulty": "Easy",
    "code": "year = 2024\\nis_leap = year % 400 == 0 or (year % 4 == 0 and year % 100 != 0)\\nprint(is_leap)",
    "out": "True"
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    "id": "quiz-1",
    "q": "Which keyword is used to define a function in Python?",
    "a": [
      "func",
      "function",
      "def",
      "define"
    ],
    "correct": 2,
    "why": "Python uses the def keyword to define a function."
  },
  {
    "id": "quiz-2",
    "q": "What is the output of print(2 ** 3)?",
    "a": [
      "6",
      "8",
      "9",
      "5"
    ],
    "correct": 1,
    "why": "The ** operator performs exponentiation: 2³ = 8."
  },
  {
    "id": "quiz-3",
    "q": "Which collection is mutable?",
    "a": [
      "tuple",
      "str",
      "list",
      "int"
    ],
    "correct": 2,
    "why": "Lists can be changed after creation; tuples and strings are immutable."
  },
  {
    "id": "quiz-4",
    "q": "What does len('Python') return?",
    "a": [
      "5",
      "6",
      "7",
      "Error"
    ],
    "correct": 1,
    "why": "Python has six characters."
  },
  {
    "id": "quiz-5",
    "q": "Which statement handles an exception?",
    "a": [
      "catch",
      "except",
      "error",
      "rescue"
    ],
    "correct": 1,
    "why": "Python uses try and except blocks to handle exceptions."
  },
  {
    "id": "quiz-6",
    "q": "What is the result of bool(0)?",
    "a": [
      "True",
      "False",
      "0",
      "None"
    ],
    "correct": 1,
    "why": "Zero is a falsy value in Python."
  },
  {
    "id": "quiz-7",
    "q": "Which data structure stores key-value pairs?",
    "a": [
      "set",
      "tuple",
      "dictionary",
      "list"
    ],
    "correct": 2,
    "why": "A dict maps keys to values."
  },
  {
    "id": "quiz-8",
    "q": "What does range(3) generate?",
    "a": [
      "1,2,3",
      "0,1,2",
      "0,1,2,3",
      "3 only"
    ],
    "correct": 1,
    "why": "range(3) starts at zero and stops before three."
  },
  {
    "id": "quiz-9",
    "q": "Which method adds one item to the end of a list?",
    "a": [
      "push()",
      "append()",
      "extend_one()",
      "insert_end()"
    ],
    "correct": 1,
    "why": "append(value) adds one value at the end of a list."
  },
  {
    "id": "quiz-10",
    "q": "What is the result of 10 // 3?",
    "a": [
      "3",
      "3.33",
      "1",
      "4"
    ],
    "correct": 0,
    "why": "The // operator performs floor division, giving 3."
  },
  {
    "id": "quiz-11",
    "q": "Which value represents the absence of a value in Python?",
    "a": [
      "null",
      "undefined",
      "None",
      "void"
    ],
    "correct": 2,
    "why": "Python uses the singleton value None."
  },
  {
    "id": "quiz-12",
    "q": "How do you get a dictionary value without an error for a missing key?",
    "a": [
      "dict.get(key)",
      "dict.find(key)",
      "dict.value(key)",
      "dict.read(key)"
    ],
    "correct": 0,
    "why": "get(key) returns None or a supplied default when a key is missing."
  },
  {
    "id": "quiz-13",
    "q": "What does enumerate(items) provide?",
    "a": [
      "Sorted items",
      "Index and item pairs",
      "Only item indexes",
      "Unique items"
    ],
    "correct": 1,
    "why": "enumerate yields pairs containing an index and its corresponding item."
  },
  {
    "id": "quiz-14",
    "q": "Which keyword starts a generator function's yielded value?",
    "a": [
      "return",
      "yield",
      "emit",
      "next"
    ],
    "correct": 1,
    "why": "yield produces a value and suspends the generator until it is resumed."
  },
  {
    "id": "quiz-15",
    "q": "What does 'hello'.upper() return?",
    "a": [
      "Hello",
      "HELLO",
      "hello",
      "Error"
    ],
    "correct": 1,
    "why": "upper() returns a new uppercase string."
  },
  {
    "id": "quiz-16",
    "q": "Which statement opens a file and manages its cleanup?",
    "a": [
      "with open(...) as file:",
      "using open(...)",
      "file = managed(...)",
      "open safely"
    ],
    "correct": 0,
    "why": "The with statement closes the file when its block exits."
  },
  {
    "id": "quiz-17",
    "q": "What is bool([]) in Python?",
    "a": [
      "True",
      "False",
      "None",
      "Error"
    ],
    "correct": 1,
    "why": "An empty list is falsy, so bool([]) is False."
  },
  {
    "id": "quiz-18",
    "q": "Which operator checks whether two names refer to the same object?",
    "a": [
      "==",
      "is",
      "equals",
      "in"
    ],
    "correct": 1,
    "why": "is tests object identity; == tests value equality."
  },
  {
    "id": "quiz-19",
    "q": "What does a function return if it has no return statement?",
    "a": [
      "0",
      "False",
      "None",
      "An empty string"
    ],
    "correct": 2,
    "why": "A function without an explicit return statement returns None."
  },
  {
    "id": "quiz-20",
    "q": "What does zip(names, scores) produce?",
    "a": [
      "Pairs of corresponding items",
      "A sorted list",
      "A dictionary automatically",
      "Only the longer input"
    ],
    "correct": 0,
    "why": "zip pairs items from each iterable by position and stops when the shortest iterable ends."
  }
];

export const INTERVIEWS_DATA: InterviewQA[] = [
  {
    "id": "interview-1",
    "category": "Core Python",
    "question": "What is Python?",
    "answer": "Python is a high-level, interpreted, general-purpose language with readable syntax and a broad ecosystem.",
    "frequency": "Very High"
  },
  {
    "id": "interview-2",
    "category": "Core Python",
    "question": "What is the difference between a list and a tuple?",
    "answer": "A list is mutable, while a tuple is immutable. Both are ordered sequences.",
    "frequency": "Very High"
  },
  {
    "id": "interview-3",
    "category": "Core Python",
    "question": "What is PEP 8?",
    "answer": "PEP 8 is the Python style guide that recommends conventions for readable and consistent Python code.",
    "frequency": "Essential"
  },
  {
    "id": "interview-4",
    "category": "Core Python",
    "question": "What is a dictionary?",
    "answer": "A dictionary is a mapping of hashable keys to values. It preserves insertion order in current Python versions.",
    "frequency": "Very High"
  },
  {
    "id": "interview-5",
    "category": "Core Python",
    "question": "What is the difference between == and is?",
    "answer": "== checks value equality. is checks object identity—whether both references point to the same object.",
    "frequency": "Essential"
  },
  {
    "id": "interview-6",
    "category": "Core Python",
    "question": "What is a lambda function?",
    "answer": "A lambda is a small anonymous function expression, often used for simple callbacks or key functions.",
    "frequency": "Very High"
  },
  {
    "id": "interview-7",
    "category": "Core Python",
    "question": "What is inheritance?",
    "answer": "Inheritance lets a class derive behavior and attributes from another class.",
    "frequency": "High"
  },
  {
    "id": "interview-8",
    "category": "Core Python",
    "question": "What is exception handling?",
    "answer": "It uses try, except, else, and finally blocks to handle runtime errors and control cleanup.",
    "frequency": "High"
  },
  {
    "id": "interview-9",
    "category": "Data Structures",
    "question": "What is a generator?",
    "answer": "A generator yields values lazily, usually using yield, instead of creating the entire sequence at once.",
    "frequency": "Very High"
  },
  {
    "id": "interview-10",
    "category": "Data Structures",
    "question": "What is the purpose of __init__?",
    "answer": "It is the initializer called when an instance is created, commonly used to set instance attributes.",
    "frequency": "High"
  },
  {
    "id": "interview-11",
    "category": "Data Structures",
    "question": "What is a virtual environment?",
    "answer": "An isolated Python environment with its own installed dependencies for a project.",
    "frequency": "Essential"
  },
  {
    "id": "interview-12",
    "category": "Data Structures",
    "question": "What is list comprehension?",
    "answer": "A concise syntax to construct a list from an iterable, optionally applying a condition, e.g. [x*x for x in range(5)].",
    "frequency": "High"
  },
  {
    "id": "interview-13",
    "category": "Data Structures",
    "question": "What is the LEGB rule?",
    "answer": "It is Python's name lookup order: Local, Enclosing, Global, and Built-in scopes.",
    "frequency": "Very High"
  },
  {
    "id": "interview-14",
    "category": "Data Structures",
    "question": "What is the difference between append() and extend()?",
    "answer": "append adds its argument as one item. extend iterates over its argument and adds each item.",
    "frequency": "High"
  },
  {
    "id": "interview-15",
    "category": "Data Structures",
    "question": "What is a decorator?",
    "answer": "A decorator is a callable that wraps another function or class to add or change behavior.",
    "frequency": "High"
  },
  {
    "id": "interview-16",
    "category": "Data Structures",
    "question": "What is a context manager?",
    "answer": "An object that manages setup and cleanup around a with block, commonly used for files and locks.",
    "frequency": "Essential"
  },
  {
    "id": "interview-17",
    "category": "OOP & Memory",
    "question": "What is the difference between shallow and deep copy?",
    "answer": "A shallow copy creates a new outer object but shares nested objects; a deep copy recursively copies nested objects.",
    "frequency": "High"
  },
  {
    "id": "interview-18",
    "category": "OOP & Memory",
    "question": "What does __name__ == '__main__' mean?",
    "answer": "It checks whether a Python file is being run as the main program rather than imported as a module.",
    "frequency": "Very High"
  },
  {
    "id": "interview-19",
    "category": "OOP & Memory",
    "question": "What is the difference between a module and a package?",
    "answer": "A module is a Python source file. A package organizes related modules under a package structure.",
    "frequency": "High"
  },
  {
    "id": "interview-20",
    "category": "OOP & Memory",
    "question": "What is a virtual environment?",
    "answer": "An isolated Python environment that keeps a project's installed packages separate from other projects.",
    "frequency": "High"
  },
  {
    "id": "interview-21",
    "category": "OOP & Memory",
    "question": "How does a set differ from a list?",
    "answer": "A set stores unique hashable values and does not provide positional indexing; a list is ordered and can contain duplicates.",
    "frequency": "Very High"
  },
  {
    "id": "interview-22",
    "category": "OOP & Memory",
    "question": "What is a mutable default argument pitfall?",
    "answer": "A mutable default object is created once and reused across calls. Use None as a default and create a fresh object inside.",
    "frequency": "High"
  },
  {
    "id": "interview-23",
    "category": "OOP & Memory",
    "question": "What is an iterator?",
    "answer": "An iterator supplies values one at a time through __next__ and raises StopIteration when it is exhausted.",
    "frequency": "Essential"
  },
  {
    "id": "interview-24",
    "category": "OOP & Memory",
    "question": "What is duck typing?",
    "answer": "A style of programming that relies on an object's supported operations rather than its declared class.",
    "frequency": "High"
  },
  {
    "id": "interview-25",
    "category": "Advanced & Placement",
    "question": "Why use enumerate() in a loop?",
    "answer": "It provides both an index and item while iterating, avoiding manual index counters.",
    "frequency": "Very High"
  },
  {
    "id": "interview-26",
    "category": "Advanced & Placement",
    "question": "What is PEP 484?",
    "answer": "PEP 484 introduced the standard type-hinting approach used by Python annotations and static type checkers.",
    "frequency": "High"
  },
  {
    "id": "interview-27",
    "category": "Advanced & Placement",
    "question": "What is the difference between sort() and sorted()?",
    "answer": "sort() changes a list in place and returns None; sorted() returns a new sorted list from an iterable.",
    "frequency": "High"
  },
  {
    "id": "interview-28",
    "category": "Advanced & Placement",
    "question": "What does the finally block do?",
    "answer": "A finally block runs when the try statement exits, whether or not an exception occurred.",
    "frequency": "High"
  },
  {
    "id": "interview-29",
    "category": "Advanced & Placement",
    "question": "How can you safely read JSON from a file?",
    "answer": "Open the file with a context manager and pass the file object to json.load, handling invalid JSON where appropriate.",
    "frequency": "Very High"
  },
  {
    "id": "interview-30",
    "category": "Advanced & Placement",
    "question": "What is a lambda function best suited for?",
    "answer": "A lambda is useful for a short expression, often as a temporary key or callback; use def for clearer multi-step logic.",
    "frequency": "High"
  }
];
