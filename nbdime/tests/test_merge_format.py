
import pytest
import json
import os
from jsonschema import RefResolver
from jsonschema import Draft4Validator as Validator
from nbdime import decide_merge
from nbdime.merging.notebooks import decide_notebook_merge
from .fixtures import matching_nb_triplets

schema_dir = os.path.abspath(os.path.join(
        os.path.dirname(__file__),
        '..'
))
schema_path = os.path.join(
    schema_dir,
    'merge_format.schema.json')
with open(schema_path) as f:
    schema_json = json.load(f)

validator = Validator(
    schema_json,
    resolver=RefResolver(
        'file://localhost/' + schema_dir.replace('\\', '/') + '/',
        schema_json),
    # Ensure tuples validate to "array" schema type 
    types={"array" : (list, tuple)},
)


def test_check_schema():
    Validator.check_schema(schema_json)

def test_validate_obj_merge():
    b = {"p": {"b": 1}}
    l = {"p": {"b": 1}, "n": {"s": 7, "l": 2}}
    r = {"p": {"b": 1}, "n": {"s": 7, "r": 3}}
    decisions = decide_merge(b, l, r)

    validator.validate(decisions)


def test_validate_array_merge():
    b = [1, 9]
    l = [1, 2, 7, 9]
    r = [1, 3, 7, 9]
    decisions = decide_merge(b, l, r)

    validator.validate(decisions)


def test_validate_matching_notebook_merge(matching_nb_triplets):
    base, local, remote = matching_nb_triplets
    decisions = decide_notebook_merge(base, local, remote)

    validator.validate(decisions)
